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
    private loader: BABYLON.AssetsManager;

    constructor(canvasElement: string)
    {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(this.canvas,true);
    }
    createScene(): void {
        this.scene = new BABYLON.Scene(this.engine);
        this.player = new Player(this.scene);
        this.camera = this.player.getCamera();
        this.loader =  new BABYLON.AssetsManager(this.scene);

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
            h.intensity = 0.6;

            var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1,-1,0), this.scene);
            h.intensity = 0.3;
            this.axis();
        }

        this.loader.load();

    }
    startup(): void {
        this.engine.runRenderLoop(()=> {
            this.scene.render();
        });

        window.addEventListener('resize', ()=> {
            this.engine.resize();
        });
    }
    private axis(): void{
        //X axis
        let x = BABYLON.Mesh.CreateCylinder("x", 5, 0.1, 0.1, 1, 1, this.scene);
        let xmat = new BABYLON.StandardMaterial("xColor", this.scene);
        xmat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        x.material = xmat;
        x.position = new BABYLON.Vector3(5/2, 0, 0);
        x.rotation.z = Math.PI / 2;

        //Y axis
        let y = BABYLON.Mesh.CreateCylinder("y", 5, 0.1, 0.1, 1,1, this.scene);
        let ymat = new BABYLON.StandardMaterial("yColor", this.scene);
        ymat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        y.material = ymat;
        y.position = new BABYLON.Vector3(0, 5 / 2, 0);

        //Z axis
        let z = BABYLON.Mesh.CreateCylinder("z", 5, 0.1, 0.1, 1,1, this.scene);
        let zmat = new BABYLON.StandardMaterial("zColor", this.scene);
        zmat.diffuseColor = new BABYLON.Color3(0, 0, 1);
        z.material = zmat;
        z.position = new BABYLON.Vector3(0, 0, 5/2);
        z.rotation.x = Math.PI / 2;
    }
}

let game = new Game('renderCanvas');
game.createScene();
game.startup();
