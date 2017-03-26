//Start the websocket server
import * as WebSocket from 'ws';
import { WebSocketHandler } from './webSocketHandler';

console.log("Starting on port 3010");
const wsServer = new WebSocket.Server({port: 3010});
const serverHandler = new WebSocketHandler(wsServer);
wsServer.on("connection",(socket) => {
    serverHandler.addConnection(socket);
});