import * as WebSocket from 'ws';
import * as winston from 'winston';
import { GameSession } from './gameSession';
import { Player } from './game/player';
import { Commands } from '../lib/network/command/commands';

export class GameServer {
    private server: WebSocket.Server;
    private currentId:number = 0;
    private sessions :{[id:string]: GameSession} = {};
    private clientSessionMap :{[id:string] : string} = {};

    constructor(server: WebSocket.Server) {
        this.server = server;
    }
    public addConnection(socket:WebSocket, gameId: string):void {
        let id = this.currentId++;
        this.clientSessionMap[id] = gameId;
        //Add player to session
        //Send client id
        socket.send("!"+Commands.CCI+id);
        winston.debug("Adding connection: ", id);
        //Bind events for socket
        socket.on("error",(cb)=> {
            winston.error("Error",JSON.stringify(cb, null, 4));
        });
        socket.on("close",(code,message) => {
            winston.debug("Closing socket with code "+code+": ",message);
            this.removeClient(id);
        });
        socket.on("message",(data,flags) => {
            //socket.send("Recieved: "+data);
            this.messageReceived(data, id, gameId);
        });
        //Check if this session has been created
        if(!this.sessions[gameId]) {
            this.sessions[gameId] = new GameSession(gameId);
        }
        //Add the connection as a player to the session
        let player = new Player(socket,id);
        this.sessions[gameId].addPlayer(player,id);
    }

    private messageReceived(data:string, clientId:number, gameId: string):void {
        let session = this.sessions[gameId];
        //If the first character is an exclamation mark, assume a command
        if(data[0] === '!') {
            session.playerCommandReceived(data);
        } else if(data[0] === '{' || data[0] === '[') { 
            //if the test start with a bracket or array assume its json
            try{
                let jsonData = JSON.parse(data);
                session.playerJsonDataReceived(jsonData);
            } catch (e) {
                winston.warn("Failed parsing message");
            }
        } 
        else
        {
            //Command was neither log it and ignore
            winston.debug("Receiver data nether command nor json: "+data);
        }
    }

    private removeClient(clientId:number):void {
        winston.debug("Removing client "+clientId);
        if(!!this.clientSessionMap[clientId]) {
            let sessionId: string = this.clientSessionMap[clientId];
            this.sessions[sessionId].removePlayer(clientId);
            delete this.clientSessionMap[clientId];
        } else {
            winston.warn("Tried to remove non existing clientID:",clientId);
        }
    }
}