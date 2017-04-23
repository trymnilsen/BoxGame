import * as HRI from 'human-readable-ids';
import * as redis from 'ioredis';
import * as bluebird from 'bluebird';
import * as winston from 'winston';
import { GameWorld } from './gameworld';
import { Player } from './game/player';
import { Commands } from '../lib/network/command/commands';
import { PCIEncode } from '../lib/network/command/pci.command';

export class GameSession {

    private players : {[id:number] : Player} = {};
    private numOfCurrentPlayers: number = 0;
    private gameWorld: GameWorld;
    private commandDecoder: {[id:string] : (data: string | Object) => Object} = {};

    public static redisClient: redis.Redis;
    public readonly Id: string;
    

    public constructor(sessionId: string) {
        this.Id = sessionId;
        this.commandDecoder = Commands.getDecoders();
    }

    public addPlayer(player: Player, clientId: number): void {
        this.players[clientId] = player;
        winston.debug("Adding player: "+player.Name+" id: "+clientId);
        //Send connected player
        player.send(PCIEncode({p:this.getPlayerList()}));
        //If this is the first player to connect to the session, give them host responsibility
        if(this.numOfCurrentPlayers == 1)
        {
            player.send(Commands.HRS);
        }
        //Send player joined command
        this.broadcast(Commands.ObjectToJson(Commands.PJI, {
            n: player.Name,
            i: player.ClientId
        }), player.ClientId);
    }
    public removePlayer(clientId: number) {
        this.players[clientId].disconnect();
        delete this.players[clientId];
    }

    public playerCommandReceived(data:string):void {
        //console.log('Player Command Received:'+data);

        let command = null;
        let type = data.substring(1,4);
        let decoder = this.commandDecoder[type];
        if(!!decoder) {command = decoder(data);}

        switch(type){
            case Commands.PPU:
                this.broadcast(data, command.c);
            default:
                break;
        }
    }
    public playerJsonDataReceived(data:Object): void {

    }
    private broadcast(data:string, source?: number) {
        for (let key in <any>this.players) {
            if (this.players.hasOwnProperty(key)) {
                if((source !== undefined) && key === source.toString()) {continue;}
                let player: Player = this.players[key];
                player.send(data);
            }
        }
    }
    private getPlayerList(): {[id:number]: string} {
        let players = {};
        for (let key in <any>this.players) {
            if (this.players.hasOwnProperty(key)) {
                players[key] = this.players[key].Name;
            }
        }
        return players;
    }
    public static async sessionExists(id: string): Promise<boolean> {
        return new bluebird<boolean>(async(resolve,reject)=> {
            let exists: boolean = await this.redisClient.exists(id);
            if(exists) {resolve(true);} 
            else {resolve(false);}
        });
    }

    public static async createSessionId(): Promise<string> {
        //return new GameSession(sessionId);
        winston.debug("GameSession::createSession() Called");
        return new bluebird<string>(async(resolve,reject)=> {
            let validId: string = null;
            let attempts: number = 0;
            do {
                //Generate a new id
                let id: string = HRI.hri.random();
                winston.debug("Got HRI:"+id);
                //Fetch it from redis
                let exists: boolean = await this.redisClient.exists(id);
                winston.debug("Id Exists in redis:",!!exists);
                if(exists == false) { validId = id; }
                else {attempts++;}
            } while(validId === null && attempts<100)
            if(validId === null) {reject();}
            else {
                //Add the entry
                winston.debug("Adding entry to redis");
                await this.redisClient.set(validId,"SESS");
                resolve(validId);           
            }
        });
    }

}