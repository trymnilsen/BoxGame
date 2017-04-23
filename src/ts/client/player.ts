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
    private IsInBotMode: boolean = false;
    private velocityChangeCount: number = 0;
    private headingChangeCount: number = 0;
    private headingTarget: number = 0;
    private headingChangeTime: number = 0;
    private headingChangeMax: number = 240;
    private velocityChangeCountMax: number = 400;
    private changeSpeed: number = 1;
    private velocityt: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    constructor(scene: BABYLON.Scene, assetManager: BABYLON.AssetsManager) {
        this.assetManager = assetManager;
        this.spawnPoint = new BABYLON.Vector3(0,20,20);
        this.scene = scene;

        this.initPlayerMesh();
        this.initPointerLock();
        this.initCamera();

        window['botMode'] = ()=> {
            this.IsInBotMode = !this.IsInBotMode;
            console.log('BotMode state: ',!!this.IsInBotMode);
            this.velocityChangeCount = this.velocityChangeCountMax -1;
        };
        window['botParams'] = (changespeed, velchange, headchange, headtarget, speed) => {
            this.changeSpeed = changespeed;
            this.velocityChangeCountMax = velchange;
            this.headingChangeMax = headchange;
            this.headingTarget = headtarget;
            this.speed = speed;
            console.log("Bot params changed");
        };

    }
    public update(deltaTime: number) : void {


        let velocity: BABYLON.Vector3 = BABYLON.Vector3.Zero();
        if(this.IsInBotMode) {
            if(this.changeSpeed>0) {
                if(this.velocityChangeCount>this.velocityChangeCountMax) {
                    this.velocityChangeCount = 0;
                    //Create a new direction to travel in
                    let dir = Math.random() * 2 * Math.PI;
                    let x = Math.cos(dir);
                    let y = -Math.sin(dir);

                    this.velocityt = new BABYLON.Vector3(x * this.speed,0,y *this.speed);
                    console.log("update velocity target:",this.velocityt);
                }
                //Safe guard against box falling off
                if(this.boxMesh.absolutePosition.x>190 || this.boxMesh.absolutePosition.x<-190)
                {
                    this.velocityt = new BABYLON.Vector3(this.velocityt.x * -1, 0, this.velocityt.z);
                    this.velocityChangeCount = 0;
                    console.log("Safety engaged! reverting");
                }
                if(this.boxMesh.absolutePosition.z>190 || this.boxMesh.absolutePosition.z<-190)
                {
                    this.velocityt = new BABYLON.Vector3(this.velocityt.x, 0, this.velocityt.z * -1);
                    this.velocityChangeCount = 0;
                    console.log("Safety engaged! reverting");
                }

                velocity = this.velocityt;
                let hdgChange: number = 0;
                if(this.headingChangeCount>this.headingChangeMax) {
                    let heading = Math.random() * 360   - 180 ;
                    let time = Math.random() * 200;
                    time = Math.max(time,40);
                    this.headingTarget = heading / time;
                    this.headingChangeCount = 0;
                    console.log("Updated heading",this.headingTarget);
                } else {
                    this.boxMesh.rotation.y += this.headingTarget * deltaTime;
                }
                this.headingChangeCount +=1 * this.changeSpeed;
                this.velocityChangeCount += 1 * this.changeSpeed;
            }
        } else {
            let movement: boolean = false;

            this.boxMesh.rotation.y = (<BABYLON.ArcRotateCamera>this.camera).alpha * -1;
            let forward = new BABYLON.Vector3(Math.sin(this.boxMesh.rotation.y - Math.PI / 2), 0, Math.cos(this.boxMesh.rotation.y - Math.PI / 2));
            if (Keyboard.IsKeyDown(Keyboard.W)) {
                velocity = forward;
                movement = true;
            }
            if (Keyboard.IsKeyDown(Keyboard.S)) {
                velocity = forward.scale(-1);
                movement = true;
            }
            if (Keyboard.IsKeyDown(Keyboard.A)) {
                //Create perpendicular vector
                velocity = velocity.add(new BABYLON.Vector3(forward.z * -1, 0, forward.x));
                movement = true;
            }
            if (Keyboard.IsKeyDown(Keyboard.D)) {
                let vector = new BABYLON.Vector3(forward.z * -1, 0, forward.x);
                velocity = velocity.add(vector.scale(-1));
                movement = true;
            }

            if (movement === true) {
                velocity = velocity.normalize().scale(this.speed);
            }


            if (Keyboard.IsKeyDown(Keyboard.Space)) {
                this.jumpingVelocity = 5;
                console.log("JUMP!");
            }

            if (this.jumpingVelocity > 0) {
                this.jumpingVelocity += this.scene.gravity.y;
                console.log("Jump velocity" + this.jumpingVelocity);
            }
            else {
                this.jumpingVelocity = 0;
            }
        }

        velocity = velocity.scale(deltaTime);
        velocity = velocity.add(this.scene.gravity);
        velocity.y += this.jumpingVelocity;
        if (window["velLogging"] === true) {
            //console.log(velocity);
            console.log(this.boxMesh.absolutePosition);
        }
        this.boxMesh.moveWithCollisions(velocity);
        (<BABYLON.ArcRotateCamera>this.camera).target = this.boxMesh.position.add(new BABYLON.Vector3(0,4,0));
    }
    public getMesh(): BABYLON.AbstractMesh {
        return this.boxMesh;
    }
    public getCamera(): BABYLON.Camera {
        return this.camera;
    }
    private initPlayerMesh(): void {
        let assetTask = <BABYLON.MeshAssetTask>this.assetManager.
            addMeshTask("box", "", "/static/assets/", "box.babylon");

        assetTask.onSuccess = (task)=> {
            this.boxMesh = assetTask.loadedMeshes[0];
            this.boxMesh.scaling = new BABYLON.Vector3(0.1,0.1,0.1);
            this.boxMesh.position = this.spawnPoint;
            this.boxMesh.checkCollisions = true;
            // this.boxMesh.onCollideObservable.add((one,two)=> {
            //     console.log("Collision",one,two);
            // },);
            this.boxMesh
            //this.initPointerLock();
        };
    }

    private initCamera(): void {

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