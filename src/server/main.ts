//Start the websocket server
import * as WebSocket from 'ws';
import { WebSocketHandler } from './webSocketHandler';

console.log("Starting on port 8091");
const wsServer = new WebSocket.Server({port: 8091});
const serverHandler = new WebSocketHandler(wsServer);
wsServer.on("connection",(socket) => {
    serverHandler.addConnection(socket);
});