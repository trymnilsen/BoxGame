import { PPUCommand } from '../lib/network/command/commandDefinitions';
import { Player } from './actor/player';
import { Opponent } from './actor/opponent';
import { BoxCharacter } from './actor/boxCharacter';
import { AssetCache } from './assetCache';
import * as _ from 'lodash';

export class World {
    private scene: BABYLON.Scene;
    private assetManager: BABYLON.AssetsManager;
    private assetCache: AssetCache;
    public player: Player;
    public opponents: { [id: string]: Opponent } = {};

    public constructor(assetManager: BABYLON.AssetsManager, scene: BABYLON.Scene) {
        this.assetCache = new AssetCache();
        this.scene = scene;
    }
    public addLoadTasks(): void {
        //Load the test level
        let testLeveltask = this.assetManager.addMeshTask("level", "", "/static/assets/", "testlevel.babylon");
        //Load the box model
        let boxTask = this.assetManager.addMeshTask(BoxCharacter.boxMeshId, "", "/static/assets/", "box.babylon");
        testLeveltask.onSuccess = (task) => {
            let levelMesh = (<BABYLON.MeshAssetTask>task).loadedMeshes[0];
            levelMesh.checkCollisions = true;
        };
        boxTask.onSuccess = (task) => {
            let boxMesh = (<BABYLON.MeshAssetTask>task).loadedMeshes[0];
            boxMesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
            boxMesh.checkCollisions = true;

            this.assetCache.AddCloneOnGetMesh(BoxCharacter.boxMeshId, "BoxMesh", boxMesh);
            // this.boxMesh.onCollideObservable.add((one,two)=> {
            //     console.log("Collision",one,two);
            // },);
            //this.initPointerLock();
        };
    }

    public addOpponent(clientId: string, name: string) {
        let opponentMesh = this.assetCache.GetMesh(BoxCharacter.boxMeshId);
        let opponent = new Opponent(opponentMesh);
        this.opponents[clientId] = opponent;
    }
    public updateOpponent(ppu: PPUCommand) {
        let clientId = ppu.c;
        let opponent = this.opponents[clientId];
        if (!!opponent) {
            opponent.updatePositionAndOrientation(ppu.x, ppu.y, ppu.z, ppu.h);
        }
    }
    public assetsFinishedLoading(): void {
        this.scene.collisionsEnabled = true;
        //this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        // Hemispheric light to light the scene
        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), this.scene);
        h.intensity = 0.8;

        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, -1, 0), this.scene);
        h.intensity = 0.5;

        //Create the player
        this.player = new Player(this.assetCache.GetMesh(BoxCharacter.boxMeshId));
        
    }
    public update(deltaTime: number) {
        _.forOwn(this.opponents, (value, key) => {
            value.update(deltaTime);
        });

        this.player.update(deltaTime);
    }
}