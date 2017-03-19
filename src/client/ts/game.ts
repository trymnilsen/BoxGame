/// <reference path="../node_modules/babylonjs/babylon.d.ts" />
import { Player } from './player';
import { TestLevel } from './testlevel';

class Game
{
    private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.Camera;
    private player: Player;
    private playerTestLevel: TestLevel;
    private light: BABYLON.Light;

    constructor(canvasElement: string)
    {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(this.canvas,true);
    }
    createScene(): void {
        this.scene = new BABYLON.Scene(this.engine);
        this.player = new Player(this.scene);
        this.camera = this.player.getCamera();

        BABYLON.SceneLoader.Load("assets/","testlevel.babylon",this.engine,()=> {
            //this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
            this.scene.collisionsEnabled = true;

            //var cam = this.scene.activeCamera;
            //cam.applyGravity = true;
            //cam.ellipsoid = new BABYLON.Vector3(1, 2, 1);
            //cam.checkCollisions = true;

            this.scene.meshes.forEach(function(mesh) {
                    mesh.isVisible = false;
            });
        });
        // Hemispheric light to light the scene
        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,1,0), this.scene);
        h.intensity = 0.2;
    }
    startup(): void {
        this.engine.runRenderLoop(()=> {
            this.scene.render();
        });

        window.addEventListener('resize', ()=> {
            this.engine.resize();
        });
    }
}

let game = new Game('renderCanvas');
game.createScene();
game.startup();
