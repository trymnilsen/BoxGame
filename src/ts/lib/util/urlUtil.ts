export class URLUtil {
    public static GetIdFromPath(path: string): string {
        return path.replace('/',''); //TODO: Make more intelligent?
    }
}