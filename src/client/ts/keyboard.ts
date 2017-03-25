/**
 * Keeps and exposes the state of the keyboard from keydown events
 * 
 * @export
 * @class Keyboard
 */
export class Keyboard {
    
    public static W = 87;
    public static A = 65;
    public static S = 83;
    public static D = 68;
    public static Space = 32;
    /**
     * Map keeping track of keydown up events
     * 
     * @private
     * @static
     * @type {{ [id:number] :boolean;}}
     * @memberOf Keyboard
     */
    private static keyMap: { [id:number] :boolean;} = [];
    private static checkedKeys : Array<number> = [];
    /**
     * Initalizes the keyboard events needed to track state
     * Needs to be called before use
     * 
     * @static
     * 
     * @memberOf Keyboard
     */
    public static init():void {

        window.addEventListener("keydown", (event) => {
            if(!!!Keyboard.keyMap[event.keyCode] === true)
            {
                Keyboard.keyMap[event.keyCode] = true;
                console.log("Key Down:"+String.fromCharCode(event.keyCode));
            }
        }, false);
        window.addEventListener("keyup", (event) => {
             Keyboard.checkedKeys.push(event.keyCode);
             console.log("Key Up:"+String.fromCharCode(event.keyCode));
        }, false);
    }
    public static onFrame(): void {
        for (let i = 0, l = Keyboard.checkedKeys.length; i < l; i++) {
            Keyboard.keyMap[Keyboard.checkedKeys[i]] = false;
        }
        Keyboard.checkedKeys = [];
    }
    /**
     * Query if the given keycode is currently pressed
     * 
     * @static
     * @param {number} keycode
     * @returns {boolean} 
     * 
     * @memberOf Keyboard
     */
    public static IsKeyDown(keycode: number): boolean {
        return !!Keyboard.keyMap[keycode];
    }

}