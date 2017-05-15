export class BoxCharacter {
    public static boxMeshId: string = "Box";
    protected boxMesh : BABYLON.AbstractMesh;
    protected speed: number = 20;
    public constructor(mesh: BABYLON.AbstractMesh) {
        this.boxMesh = mesh;
    }

    public loadMesh(): void {
        
    }
    public destroy(): void {
        this.boxMesh.dispose();
    }
}