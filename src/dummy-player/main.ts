import { DummyClient } from './dummyClient';
import * as WebSocket from 'ws';

const numOfClient: number = 5;
let clients: Array<DummyClient> = [];

for (var i = 0; i < numOfClient; i++) {
    clients.push(new DummyClient());
}