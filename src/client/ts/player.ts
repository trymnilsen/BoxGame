export class Player {
    
    private spawnPoint: BABYLON.Vector3;
    private scene: BABYLON.Scene;
    private height: number = 2;
    private speed: number = 8;
    private inertia: number = 0;
    private angularInertia: number;
    private camera: BABYLON.Camera;
    private controlEnabled: boolean;
    private boxMesh: BABYLON.AbstractMesh;
    private assetManager: BABYLON.AssetsManager;
    
    constructor(scene: BABYLON.Scene, assetManager: BABYLON.AssetsManager) {
        this.assetManager = assetManager;
        this.spawnPoint = new BABYLON.Vector3(0,20,20);
        this.scene = scene;

        this.initPlayerMesh();
        this.initPointerLock();
        this.initCamera();

    }
    private initPlayerMesh(): void {
        let assetTask = <BABYLON.MeshAssetTask>this.assetManager.addMeshTask("box", "", "./assets/", "box.babylon");
        assetTask.onSuccess = (task)=> {
            this.boxMesh = assetTask.loadedMeshes[0];
            this.boxMesh.scaling = new BABYLON.Vector3(0.1,0.1,0.1);
            this.boxMesh.position = this.spawnPoint;
            this.boxMesh.checkCollisions = true;
        };
    }
    private initCamera(): void {
        var cam = new BABYLON.ArcRotateCamera("Camera",1,0.8,10,this.spawnPoint.add(new BABYLON.Vector3(0,4,0)),this.scene);
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
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);

        // Event listener when the pointerlock is updated.
        var pointerlockchange = (event) => {
            this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
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
    public getCamera(): BABYLON.Camera
    {
        return this.camera;
    }
}