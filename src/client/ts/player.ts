export class Player {
    
    private spawnPoint: BABYLON.Vector3;
    private scene: BABYLON.Scene;
    private height: number = 2;
    private speed: number = 1;
    private inertia: number = 0.9;
    private angularInertia: number;
    private camera: BABYLON.Camera;
    private controlEnabled: boolean;
    
    constructor(scene: BABYLON.Scene) {
        this.spawnPoint = new BABYLON.Vector3(0,10,10);
        this.scene = scene;
        this.initPointerLock();
        this.initCamera();

    }
    private initCamera(): void {
        var cam = new BABYLON.FreeCamera("camera", this.spawnPoint, this.scene);
        cam.attachControl(this.scene.getEngine().getRenderingCanvas());
        cam.ellipsoid = new BABYLON.Vector3(2, this.height, 2);
        cam.checkCollisions = true;
        cam.applyGravity = true;
        // WASD
        cam.keysUp = [87]; // W
        cam.keysDown = [83]; // S
        cam.keysLeft = [65]; // A
        cam.keysRight = [68]; // D
        cam.speed = this.speed;
        cam.inertia = this.inertia;
        cam.angularSensibility = 1000;
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