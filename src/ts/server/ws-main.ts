//Start the websocket server
import * as WebSocket from 'ws';
import * as winston from 'winston';
import * as redis from 'ioredis';
import { GameServer } from './game-server';
import { WsUtil } from './util/ws-util';
import { GameSession } from './gameSession';
import { initRedis } from './redisSession';
import { URLUtil } from '../lib/util/urlUtil';

export function init():void {
    
    winston.level = "debug";
    winston.debug("Starting on port 8091");
    winston.info("Starting Redis");

    let veryClientTest = (info, cb) => {
        let url: string = info.req.url;
        let sessionId: string = URLUtil.GetIdFromPath(url);
        GameSession.sessionExists(sessionId).then((valid:boolean)=> {
            if(valid == true) {cb(true);}
            else {
                cb(false); 
                winston.info("Rejecting ws connection due to non-existing sessionid");
            }
        });
    };

    initRedis().then((redisClient) => {
        //Add client reference to gamesession
        GameSession.redisClient = redisClient;

        let wsServer = new WebSocket.Server({
            port: 8091,
            verifyClient: veryClientTest
        });
        let serverHandler = new GameServer(wsServer);

        wsServer.on("connection", (socket) => {
            let url: string = socket.upgradeReq.url;
            let gameId: string = url.replace('/','');
            serverHandler.addConnection(socket, gameId);
        });
        winston.info("WS Server Ready!");

    }).catch((error)=> {
        winston.error("Redis Init error: error");
    });

}