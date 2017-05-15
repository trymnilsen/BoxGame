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
    private cameraOffset: BABYLON.Vector3;
    public camera: BABYLON.ArcRotateCamera;

    public player: Player;
    public opponents: { [id: string]: Opponent } = {};

    public constructor(assetManager: BABYLON.AssetsManager, scene: BABYLON.Scene) {
        this.assetCache = new AssetCache();
        this.scene = scene;
        this.assetManager = assetManager;
        this.cameraOffset = new BABYLON.Vector3(0,4,0);
    }
    public addLoadTasks(): void {
        //Load the test level
        let testLeveltask = this.assetManager.addMeshTask("level", "", "/static/assets/", "testlevel.babylon");
        //Load the box model
        let boxTask = this.assetManager.addMeshTask(BoxCharacter.boxMeshId, "", "/static/assets/", "box.babylon");
        testLeveltask.onSuccess = (task) => {
            (<BABYLON.MeshAssetTask>task).loadedMeshes.forEach((mesh) => {
                    mesh.isVisible = true;
                    mesh.checkCollisions = true;
            });
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
        console.log("Opponent Added: ",clientId,name);
    }
    public updateOpponent(ppu: PPUCommand) {
        let clientId = ppu.c;
        let opponent = this.opponents[clientId];
        if (!!opponent) {
            opponent.updatePositionAndOrientation(ppu.x, ppu.y, ppu.z, ppu.h);
        }
    }
    public removeOpponent(clientId: string) {
        this.opponents[clientId].destroy();
        delete this.opponents[clientId];
        console.log("Removed client: "+clientId);
    }
    public assetsFinishedLoading(): void {
        this.scene.collisionsEnabled = true;
        //this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        // Hemispheric light to light the scene
        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), this.scene);
        h.intensity = 0.8;

        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, -1, 0), this.scene);
        h.intensity = 0.5;

        let playerMesh = this.assetCache.GetMesh(BoxCharacter.boxMeshId);
        //Create the player

        this.player = new Player(playerMesh);
        
        //Create the camera
        var cam = new BABYLON.ArcRotateCamera("Camera",1,0.8,10,new BABYLON.Vector3(0,20,20),this.scene);
        cam.attachControl(this.scene.getEngine().getRenderingCanvas());
        this.scene.gravity = new BABYLON.Vector3(0,-0.5,0);
        // WASD
/*        cam.keysUp = [87]; // W
        cam.keysDown = [83]; // S
        cam.keysLeft = [65]; // A
        cam.keysRight = [68]; // D
        cam.speed = this.speed;
        cam.inertia = this.inertia;*/
        cam.layerMask = 2;
        this.camera = cam;
    }
    public update(deltaTime: number) {
        for (var key in this.opponents) {
            // skip loop if the property is from prototype
            if (!this.opponents.hasOwnProperty(key)) continue;
            this.opponents[key].update(deltaTime);
        }
        this.player.update(deltaTime);
        this.camera.target = this.player.boxPos.add(this.cameraOffset);
        this.player.heading = this.camera.alpha * -1;
    }
}