/// <reference path="../../node_modules/babylonjs/babylon.d.ts" />
import { Player } from './player';
import { TestLevel } from './testlevel';
import { Keyboard } from './keyboard';

class Game
{
    private isLoaded: boolean;
    private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.Camera;
    private player: Player;
    private playerTestLevel: TestLevel;
    private light: BABYLON.Light;
    private loader: BABYLON.AssetsManager;

    constructor(canvasElement: string)
    {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(this.canvas,true);
    }
    public createScene(): void {
        this.scene = new BABYLON.Scene(this.engine);
        this.loader =  new BABYLON.AssetsManager(this.scene);
        this.player = new Player(this.scene,this.loader);
        this.camera = this.player.getCamera();

        let meshTask = this.loader.addMeshTask("level", "", "./assets/", "testlevel.babylon");

        this.loader.onFinish = (tasks) => {
            //this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
            this.scene.collisionsEnabled = true;



            this.scene.meshes.forEach((mesh) => {
                    mesh.isVisible = true;
                    mesh.checkCollisions = true;

            });
            // Hemispheric light to light the scene
            var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,1,0), this.scene);
            h.intensity = 0.8;

            var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1,-1,0), this.scene);
            h.intensity = 0.5;
            this.isLoaded = true;
        }

        this.loader.load();

    }

    public startup(): void {
        Keyboard.init();
        this.engine.runRenderLoop(()=> {
            if(window["suspendRunning"] === true) {return;}
            if(this.isLoaded)
            {
                //Delta time is in ms, convert to a seconds
                let delta = this.scene.getEngine().getDeltaTime() * 0.001;
                this.player.update(delta);
                Keyboard.onFrame();
            }
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
