import { PPUCommand } from '../lib/network/command/commandDefinitions';
import { Player } from './actor/player';
import { Opponent } from './actor/opponent';

export class World {
    public player: Player;
    public opponents: { [id: string]: Opponent } = {};

    public constructor() {
        this.player = new Player();
    }
    public addOpponent(clientId: string, name: string) {

    }
    public updateOpponent(ppu: PPUCommand) {
        let clientId = ppu.c;
        let opponent = this.opponents[clientId];
        if (!!opponent) {
            opponent.updatePositionAndOrientation(ppu.x, ppu.y, ppu.z, ppu.h);
        }
    }
    
}