import * as WebSocket from 'ws';
import { NameGenerator } from '../util/nameGenerator';
export class Player {
    
    private socket: WebSocket;
    public readonly ClientId: number;
    public readonly Name: string; 
    public constructor(socket: WebSocket, clientId: number) {
        this.socket = socket;
        this.ClientId = clientId;
        this.Name = NameGenerator.Name();
    }
    public send(data:string) {
        this.socket.send(data);
    }
    public disconnect(): void {
        if(this.socket.readyState == 1){
            this.socket.close();
        }
    }
}