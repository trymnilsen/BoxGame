import { URLUtil } from '../lib/util/urlUtil';
import { HumanIdGenerator } from '../lib/util/humanIdGenerator';
import { config } from './config';
import { Commands } from '../lib/network/command/commands';
import { CCICommand, PPUCommand } from '../lib/network/command/commandDefinitions';
import * as _ from "lodash";
import { World } from './world';
import { GameWorld } from '../server/gameworld';
import { PPUEncode } from '../lib/network/command/ppu.command';

enum GameState {
    Connecting,
    Joining,
    Playing
}

export class Game {
    private state: GameState;
    private socket: WebSocket;
    private tickTimerId: NodeJS.Timer;
    private clientId: string;
    private gameworld: World;
    private commandDecoder: {[id:string] : (data: string | Object) => Object} = {};
    public constructor()
    {
        //Get the game id
        let gameId = this.getGameId();
        let url = `ws://${config["ws-server"]}:${config["ws-server-port"]}/${gameId}`;
        //Creat the world
        this.gameworld = new World();
        //Set up the socket
        this.socket = new WebSocket(url);
        this.socket.onopen = this.socketOpen;
        this.socket.onmessage = this.socketDataReceived;
        this.socket.onerror = this.socketError;
        //Get any special decoders
        this.commandDecoder = Commands.getDecoders();
        //Set up timer
        this.tickTimerId = setInterval(this.networkTick,200);
        this.state = GameState.Playing;
    }

    public socketSend(message: string): void {

    }
    private networkTick(): void {
        if(this.socket.readyState==1 && this.state == GameState.Playing) {
            let pos = this.gameworld.player.getPosition();
            let hdg = this.gameworld.player.getHeading();

            let ppu: PPUCommand = {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                h: hdg,
                c: this.clientId
            };

            this.socket.send(PPUEncode(ppu));
        }
    }
    private getGameId(): string {
        let path = window.location.pathname;
        return URLUtil.GetIdFromPath(path);
    }
    private routeCommand(command: Object, type:string) {
        switch(type){
            case Commands.CON:
                this.socketConnected(<CCICommand>command);
                break;
            case Commands.PCI:
                _.forOwn(command["p"],(value,key)=> {
                    //Do not add ourselves
                    if(key!=this.clientId){
                        this.gameworld.addOpponent(key,value);
                    }
                });
                break;
            case Commands.PPU:
                this.gameworld.updateOpponent(<PPUCommand>command);
                break;
            default: 
                console.warn("No Match for type:",type);
        }
    }
    private socketOpen(eventData): void {

    }

    private socketDataReceived(data): void {
        //If the first character is an exclamation mark, assume a command
        let command:Object = null;
        let type:string = null;
        if(data[0] === '!') {
            type = data.substring(1,4);
            let decoder = this.commandDecoder[type];
            if(!!decoder) {command == decoder(data);}
        } else if(data[0] === '{') { 
            //if the test start with a brace assume its json
            try{
                let jsonData = JSON.parse(data);
                //It should be wrapped
                if(!!jsonData["t"]){
                    type = jsonData["t"];
                    command = jsonData["d"];
                }
            } catch (e) {
                console.log("Error parsing json message command", e);
            }
        } 
        if(command == null) {
            console.log('Invalid command received:',data);
        } else {
            this.routeCommand(command,type);
        }
    }
    private socketConnected(con: CCICommand) {
        this.clientId = con.c+"";
        console.log("ClientID assigned:",this.clientId);
    }
    private socketError(err): void {
        //Handle errors differently if we are connected or not
        if(this.socket.readyState != 0) {
            //Handle error while connected
        } else {
            //Error occured during connecting
        }
    }
}