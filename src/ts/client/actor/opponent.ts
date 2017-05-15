import { BoxCharacter } from './boxCharacter';
export class Opponent extends BoxCharacter {
    public static readonly updateRate: number = 200;
    private target: BABYLON.Vector3;
    private lastTarget: BABYLON.Vector3;
    private totalDeltaTime: number = 0;
    public constructor(mesh: BABYLON.AbstractMesh) {
        super(mesh);
        //Spawn at a random place
        let x = Math.random() * 400 - 200;
        let z = Math.random() * 400 - 200;
        mesh.position = new BABYLON.Vector3(x,20,z);
        this.target = null;
        this.lastTarget = null;
    }
    public updatePositionAndOrientation(x:number,y:number,z:number,heading:number) {
        this.lastTarget = this.target;
        let position = new BABYLON.Vector3(x,y,z);
        this.boxMesh.rotation.y = heading;
        this.target = position;
        this.totalDeltaTime = 0;
    }
    public update(deltaTime:number) {
        if(this.lastTarget !== null && this.target !== null) {
            this.totalDeltaTime += deltaTime * 1000;
            let t = this.totalDeltaTime / Opponent.updateRate;
            if(t>1){t = 1;}
            this.boxMesh.position = BABYLON.Vector3.Lerp(this.lastTarget,this.target,t);
        }
        // if(this.target!=null){
            
        //     let velocity = this.target.subtract(this.boxMesh.position);
        //     if(velocity.lengthSquared()>this.speed * this.speed) {
        //         velocity = velocity.normalize().scale(this.speed);
        //     }
        //     this.boxMesh.moveWithCollisions(velocity.scale(deltaTime));

        // }
    }
}