export class BotPlayer {
    public heading: number;
    public velocity: BABYLON.Vector3;

    private speed: number;
    private velocityChangeCount: number = 0;
    private headingChangeCount: number = 0;
    private headingTarget: number = 0;
    private headingChangeTime: number = 0;
    private headingChangeMax: number = 240;
    private velocityChangeCountMax: number = 400;
    private changeSpeed: number = 1;
    private velocityt: BABYLON.Vector3 = BABYLON.Vector3.Zero();

    public constructor(speed: number) {
        this.speed = speed;
        this.regenVelocity();
        this.regenHeading();
    }

    public update(deltaTime: number, px: number, pz: number): void {
        if (this.changeSpeed > 0) {
            if (this.velocityChangeCount > this.velocityChangeCountMax) {
                this.regenVelocity();
            }
            //Safe guard against box falling off
            if (px > 190 || px < -190) {
                this.velocityt = new BABYLON.Vector3(this.velocityt.x * -1, 0, this.velocityt.z);
                this.velocityChangeCount = 0;
                console.log("Safety engaged! reverting");
            }
            if (pz > 190 || pz < -190) {
                this.velocityt = new BABYLON.Vector3(this.velocityt.x, 0, this.velocityt.z * -1);
                this.velocityChangeCount = 0;
                console.log("Safety engaged! reverting");
            }

            this.velocity = this.velocityt;
            let hdgChange: number = 0;
            if (this.headingChangeCount > this.headingChangeMax) {
                this.regenHeading();
            } else {
                this.heading += this.headingTarget * deltaTime;
            }
            this.headingChangeCount += 1 * this.changeSpeed;
            this.velocityChangeCount += 1 * this.changeSpeed;
        }
    }
    private regenHeading(): void {
        let heading = Math.random() * 360 - 180;
        let time = Math.random() * 200;
        time = Math.max(time, 40);
        this.headingTarget = heading / time;
        this.headingChangeCount = 0;
        console.log("Updated heading", this.headingTarget);
    }
    private regenVelocity(): void {
        this.velocityChangeCount = 0;
        //Create a new direction to travel in
        let dir = Math.random() * 2 * Math.PI;
        let x = Math.cos(dir);
        let y = -Math.sin(dir);

        this.velocityt = new BABYLON.Vector3(x * this.speed, 0, y * this.speed);
        console.log("update velocity target:", this.velocityt);
    }
}