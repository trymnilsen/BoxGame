export class URLUtil {
    public static GetIdFromPath(path: string): string {

        //return path.replace('/',''); //TODO: Make more intelligent?
        let subPaths = path.split('/').filter((element)=> {
            return !!element;
        });
        return subPaths[subPaths.length-1];
    }
}