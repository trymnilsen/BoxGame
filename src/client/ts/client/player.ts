import { Keyboard } from './keyboard';
export class Player {
    
    private spawnPoint: BABYLON.Vector3;
    private scene: BABYLON.Scene;
    private height: number = 2;
    private speed: number = 20;
    private inertia: number = 0;
    private angularInertia: number;
    private camera: BABYLON.Camera;
    private controlEnabled: boolean;
    private boxMesh: BABYLON.AbstractMesh;
    private assetManager: BABYLON.AssetsManager;
    private jumpingVelocity: number = 0;
    private isInAir: boolean = false;
    private hasDoubleJumped: boolean = false;

    constructor(scene: BABYLON.Scene, assetManager: BABYLON.AssetsManager) {
        this.assetManager = assetManager;
        this.spawnPoint = new BABYLON.Vector3(0,20,20);
        this.scene = scene;

        this.initPlayerMesh();
        this.initPointerLock();
        this.initCamera();

    }
    public update(deltaTime: number) : void {

        this.boxMesh.rotation.y = (<BABYLON.ArcRotateCamera>this.camera).alpha * -1;
        let forward = new BABYLON.Vector3(Math.sin(this.boxMesh.rotation.y - Math.PI / 2 ), 0, Math.cos(this.boxMesh.rotation.y - Math.PI / 2));

        let velocity: BABYLON.Vector3 = BABYLON.Vector3.Zero();
        let movement: boolean = false;
        if(Keyboard.IsKeyDown(Keyboard.W))
        {
            velocity = forward;
            movement = true;
        }
        if(Keyboard.IsKeyDown(Keyboard.S))
        {
            velocity = forward.scale(-1);
            movement = true;
        }
        if(Keyboard.IsKeyDown(Keyboard.A))
        {
            //Create perpendicular vector
            velocity = velocity.add(new BABYLON.Vector3(forward.z *-1, 0,forward.x));
            movement = true;
        }
        if(Keyboard.IsKeyDown(Keyboard.D))
        {
            let vector = new BABYLON.Vector3(forward.z *-1, 0,forward.x);
            velocity = velocity.add(vector.scale(-1));
            movement = true;
        }

        if(movement === true)
        {
            velocity = velocity.normalize().scale(this.speed * deltaTime);
        }
        
        
        if(Keyboard.IsKeyDown(Keyboard.Space))
        {
            this.jumpingVelocity = 5;
            console.log("JUMP!");
        }
        
        if(this.jumpingVelocity > 0)
        {
            this.jumpingVelocity += this.scene.gravity.y;
            console.log("Jump velocity"+this.jumpingVelocity);
        }
        else
        {
            this.jumpingVelocity = 0;
        }

        velocity = velocity.add(this.scene.gravity);
        velocity.y += this.jumpingVelocity;
        if(window["velLogging"] === true)
        {
            console.log(velocity);

        }
        this.boxMesh.moveWithCollisions(velocity);
        (<BABYLON.ArcRotateCamera>this.camera).target = this.boxMesh.position.add(new BABYLON.Vector3(0,4,0));
    }
    public getMesh(): BABYLON.AbstractMesh
    {
        return this.boxMesh;
    }
    public getCamera(): BABYLON.Camera
    {
        return this.camera;
    }
    private initPlayerMesh(): void {
        let assetTask = <BABYLON.MeshAssetTask>this.assetManager.
            addMeshTask("box", "", "./assets/", "box.babylon");

        assetTask.onSuccess = (task)=> {
            this.boxMesh = assetTask.loadedMeshes[0];
            this.boxMesh.scaling = new BABYLON.Vector3(0.1,0.1,0.1);
            this.boxMesh.position = this.spawnPoint;
            this.boxMesh.checkCollisions = true;
            this.boxMesh.onCollideObservable.add((one,two)=> {
                console.log("Collision",one,two);
            },);
            this.boxMesh
            //this.initPointerLock();
        };
    }

    private initCamera(): void {
        var cam = new BABYLON.ArcRotateCamera("Camera",1,0.8,10,this.spawnPoint.
            add(new BABYLON.Vector3(0,4,0)),this.scene);

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
    private initPointerLock(): void {
        // Request pointer lock
        var canvas = this.scene.getEngine().getRenderingCanvas();
        canvas.addEventListener("click", function(evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || 
                canvas.msRequestPointerLock || 
                canvas.mozRequestPointerLock || 
                canvas.webkitRequestPointerLock;

            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);

        // Event listener when the pointerlock is updated.
        var pointerlockchange = (event) => {
            this.controlEnabled = (document.mozPointerLockElement === canvas || 
                document.webkitPointerLockElement === canvas || 
                document.msPointerLockElement === canvas || 
                document.pointerLockElement === canvas);
            if (!this.controlEnabled) {
                this.camera.detachControl(canvas);
            } else {
                this.camera.attachControl(canvas);
            }
        };
        
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }
}