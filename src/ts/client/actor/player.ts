import { BoxCharacter } from './boxCharacter';
import { Keyboard } from '../keyboard';
import { BotPlayer } from '../botplayer';
export class Player extends BoxCharacter {
    private isInBotMode: boolean = false;
    private botplayer: BotPlayer;
    private velocity: BABYLON.Vector3;
    private verticalVelocity: number;
    public boxPos: BABYLON.Vector3 = new BABYLON.Vector3(0, 20, 20);
    public heading: number = 0;

    public constructor(mesh: BABYLON.AbstractMesh) {
        super(mesh);
        mesh.position = this.boxPos;
        this.boxPos = mesh.absolutePosition;
        this.botplayer = new BotPlayer(this.speed);
        window['botMode'] = () => {
            this.isInBotMode = !this.isInBotMode;
            console.log('BotMode state: ', !!this.isInBotMode);
        };
        this.velocity = BABYLON.Vector3.Zero();
    }
    public update(deltaTime: number) {

        //  if(this.isInBotMode){
        //     this.botplayer.update(deltaTime,this.boxMesh.absolutePosition.x,this.boxMesh.absolutePosition.z);
        //     testvelocity = new BABYLON.Vector3(this.botplayer.velocity.x,this.botplayer.velocity.y,this.botplayer.velocity.z);
        // //     this.heading = this.botplayer.heading;
        // } //else {
        let acceleration: BABYLON.Vector3 = BABYLON.Vector3.Zero();
        let forward = new BABYLON.Vector3(Math.sin(this.boxMesh.rotation.y - Math.PI / 2), 0, Math.cos(this.boxMesh.rotation.y - Math.PI / 2));
        if (Keyboard.IsKeyDown(Keyboard.W)) {
            acceleration = forward;
        }
        if (Keyboard.IsKeyDown(Keyboard.S)) {
            acceleration = forward.scale(-1);
        }
        if (Keyboard.IsKeyDown(Keyboard.A)) {
            //Create perpendicular vector
            acceleration = acceleration.add(new BABYLON.Vector3(forward.z * -1, 0, forward.x));
        }
        if (Keyboard.IsKeyDown(Keyboard.D)) {
            let vector = new BABYLON.Vector3(forward.z * -1, 0, forward.x);
            acceleration = acceleration.add(vector.scale(-1));
        }



        if (Keyboard.IsKeyDown(Keyboard.Space)) {
            this.verticalVelocity = 5;
            console.log("JUMP!");
        }

        if (this.verticalVelocity > 0) {
            this.verticalVelocity -= 0.8;
            console.log("Jump velocity" + this.verticalVelocity);
        }
        else {
            this.verticalVelocity = 0;
        }
        // }
        this.boxMesh.rotation.y = this.heading;

        // if(this.velocity.lengthSquared()>0) {
        //      this.velocity = this.velocity.normalize().scale(this.speed);
        // }
        //Add friction


        // testvelocity = testvelocity.scale(deltaTime);
        // testvelocity.y -= 0.8;
        acceleration.y -= 1.8;
        acceleration.y += this.verticalVelocity;
        acceleration = acceleration.scale(deltaTime);
        this.velocity = this.velocity.add(acceleration);
        this.velocity = this.velocity.add(this.velocity.scale(-0.1));

        if (this.velocity.lengthSquared() > this.speed * this.speed) {
            this.velocity = this.velocity.normalize().scale(this.speed);
        }
        if (window["velLogging"] === true) {
            console.log("Velocity", this.velocity);
            console.log("Position", this.boxMesh.absolutePosition);
        }
        // if(this.isInBotMode === true) {
        //     this.boxMesh.moveWithCollisions(testvelocity);
        // } else {
        this.boxMesh.moveWithCollisions(this.velocity);
        // }
    }
}