import { BoxCharacter } from './boxCharacter';
export class Player extends BoxCharacter {
    public constructor(mesh: BABYLON.AbstractMesh) {
        super(mesh);
    }
    public update(deltaTime: number) {

    }
}