import { BoxCharacter } from './boxCharacter';
export class Opponent extends BoxCharacter {
    private target: BABYLON.Vector3;

    public constructor(mesh: BABYLON.AbstractMesh) {
        super(mesh);
        //Spawn at a random place
        let x = Math.random() * 400 - 200;
        let z = Math.random() * 400 - 200;
        mesh.position = new BABYLON.Vector3(x,20,z);
        this.target = null;
    }
    public updatePositionAndOrientation(x:number,y:number,z:number,heading:number) {
        let position = new BABYLON.Vector3(x,y,z);
        this.boxMesh.rotation.y = heading;
         this.boxMesh.position = position; 
        this.target = position;
    }
    public update(deltaTime:number) {
        // if(this.target!=null){
            
        //     let velocity = this.target.subtract(this.boxMesh.position);
        //     if(velocity.lengthSquared()>this.speed * this.speed) {
        //         velocity = velocity.normalize().scale(this.speed);
        //     }
        //     this.boxMesh.moveWithCollisions(velocity.scale(deltaTime));

        // }
    }
}