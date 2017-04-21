export class BoxCharacter {
    public static boxMeshId: string = "Box";
    private boxMesh : BABYLON.AbstractMesh;
    public constructor(mesh: BABYLON.AbstractMesh) {
        this.boxMesh = mesh;
    }
    public getPosition(): BABYLON.Vector3 {
        return null;
    }
    public getHeading():number {
        return 0;
    }
    public loadMesh(): void {
        
    }
}