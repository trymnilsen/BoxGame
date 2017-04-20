import { PPUCommand } from '../lib/network/command/commandDefinitions';
import { Player } from './actor/player';
import { Opponent } from './actor/opponent';

export class World {
    private scene: BABYLON.Scene;
    private assetManager: BABYLON.AssetsManager;

    public player: Player;
    public opponents: { [id: string]: Opponent } = {};

    public constructor(assetManager: BABYLON.AssetsManager, scene: BABYLON.Scene) {
        this.player = new Player();
    }
    public addLoadTasks(): void {
        //Load the test level
        let meshTask = this.assetManager.addMeshTask("level", "", "/static/assets/", "testlevel.babylon");
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
    public assetsFinishedLoading(tasks: BABYLON.IAssetTask[]): void {
            //this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
            // Hemispheric light to light the scene
            var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,1,0), this.scene);
            h.intensity = 0.8;

            var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1,-1,0), this.scene);
            h.intensity = 0.5;
            this.isLoaded = true;
            this.gameworld.Loaded()
    }
    
}