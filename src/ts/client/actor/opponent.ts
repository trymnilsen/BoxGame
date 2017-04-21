import { BoxCharacter } from './boxCharacter';
export class Opponent extends BoxCharacter {
    public constructor(mesh: BABYLON.AbstractMesh) {
        super(mesh);
    }
    public updatePositionAndOrientation(x:number,y:number,z:number,heading:number) {
        
    }
    public update(deltaTime:number) {

    }
}