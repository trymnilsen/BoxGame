interface AssetDefintion {
    mesh: BABYLON.AbstractMesh,
    cloneOnGet: boolean,
    name:string,
    createCount: number
}
export class AssetCache {
    private cacheMap: {[id:string]:AssetDefintion} = {};


    public AddSingleMesh(id: string, mesh: BABYLON.AbstractMesh):void {
        this.cacheMap[id] = {
            "mesh" : mesh,
            "name" : "",
            "cloneOnGet": false,
            "createCount": 0
        };
    }
    public AddCloneOnGetMesh(id:string, name:string, mesh:BABYLON.AbstractMesh): void {
        this.cacheMap[id] = {
            "mesh": mesh,
            "name": name,
            "cloneOnGet" : true,
            "createCount" : 0
        };
    }
    public GetMesh(id: string): BABYLON.AbstractMesh {
        let assetDef = this.cacheMap[id];
        if(!!assetDef) {
            let returnMesh = null;
            if(assetDef.cloneOnGet) {
                let name = assetDef.name + assetDef.createCount++;
                returnMesh = assetDef.mesh.clone(name,null,false);
                return returnMesh;
            } else {
                return assetDef.mesh; 
            }
        } else {
            return null;
        }
    }
}