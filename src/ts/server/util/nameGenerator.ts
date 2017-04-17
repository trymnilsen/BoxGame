export class NameGenerator {
    private static names: Array<string> = ["Bob","Joe","Tom","Rich","Mortimer"];
    public static Name():string {
        return this.names[Math.floor(Math.random()*this.names.length)]
    }
}