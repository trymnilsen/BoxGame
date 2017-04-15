import * as WebSocket from 'ws';
export class WebSocketHandler {
    private server: WebSocket.Server;
    private connections: Array<WebSocket> = [];
    constructor(server: WebSocket.Server) {
        this.server = server;
    }
    public addConnection(socket:WebSocket):void {
        this.connections.push(socket);
        console.log("Adding connection: ");
        socket.on("error",(cb)=> {
            console.log("Error",JSON.stringify(cb, null, 4));
        });
        socket.on("close",(code,message) => {
            console.log("Closing socket with code "+code+": ",message);
        });
        socket.on("message",(data,flags) => {
            console.log("Message",data);
            socket.send("Recieved: "+data);
        });
        socket.on("open",()=> {
            console.log("OPEN Socket");
            socket.send("Hello from server");
        });
    }
}