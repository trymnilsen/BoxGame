/// <reference path="../../node_modules/babylonjs/babylon.d.ts" />
import * as _ from 'lodash';
import { CCICommand, PPUCommand } from '../lib/network/command/commandDefinitions';
import { Commands } from '../lib/network/command/commands';
import { config } from './config';
import { HumanIdGenerator } from '../lib/util/humanIdGenerator';
import { Keyboard } from './keyboard';
import { PPUEncode } from '../lib/network/command/ppu.command';
import { URLUtil } from '../lib/util/urlUtil';
import { World } from './world';

enum GameState {
    Initing = 0,
    Loaded = 1,
    Connecting = 2,
    Joining = 3,
    Playing = 4
}

export class Game {
    private _pointerLock: boolean;

    private state: GameState = GameState.Initing;
    private socket: WebSocket;
    private tickTimerId;
    private clientId: string;
    private gameworld: World;
    private webglCanvas: HTMLCanvasElement;
    private activeCamera: BABYLON.Camera;
    private engine: BABYLON.Engine;
    private playScene: BABYLON.Scene;
    private assetManager: BABYLON.AssetsManager;
    private commandDecoder: {[id:string] : (data: string | Object) => Object} = {};

    public get pointerLock(): boolean {
        return this._pointerLock;
    }
    public set pointerLock(value: boolean){
        this._pointerLock = value;
    }

    public constructor(canvasId: string)
    {
        //Creat the world
        console.log("LODASH VER",_.VERSION);
        this.webglCanvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.webglCanvas);
        this.playScene = new BABYLON.Scene(this.engine);
        this.assetManager = new BABYLON.AssetsManager(this.playScene);
        this.gameworld = new World(this.assetManager,this.playScene);
        this.assetManager.onFinish = this.assetsLoaded.bind(this);
        this.gameworld.addLoadTasks();
        this.assetManager.load();
        Keyboard.init();
    }

    public socketSend(message: string): void {

    }
    private assetsLoaded(tasks: BABYLON.IAssetTask[]) {
        this.gameworld.assetsFinishedLoading();
        this.initGameSession();
    }
    private initGameSession(): void {
        //Get the game id
        let gameId = this.getGameId();
        let url = `ws://${config["ws-server"]}:${config["ws-server-port"]}/${gameId}`;
        //Set up the socket
        this.socket = new WebSocket(url);
        this.socket.onopen = this.socketOpen.bind(this);
        this.socket.onmessage = this.socketDataReceived.bind(this);
        this.socket.onerror = this.socketError.bind(this);
        //Get any special decoders
        this.commandDecoder = Commands.getDecoders();
        //Set up timer
        this.tickTimerId = setInterval(this.networkTick.bind(this),200);
        this.state = GameState.Playing;

        this.engine.runRenderLoop(()=> {
            //Simple way to suspend updating
            if(window["suspendRunning"] === true) {return;}
            //If we are loaded start rendering
            if(this.state >= GameState.Loaded)
            {
                //Delta time is in ms, convert to a seconds
                let delta = this.playScene.getEngine().getDeltaTime() * 0.001;
                this.gameworld.update(delta);
                Keyboard.onFrame();
            }
            this.playScene.render();
        });


        window.addEventListener('resize', ()=> {
            this.engine.resize();
        });

    }
    private networkTick(): void {
        if(this.socket.readyState==1 && this.state == GameState.Playing) {
            let pos = this.gameworld.player.boxPos;
            let hdg = this.gameworld.player.heading;

            let ppu: PPUCommand = {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                h: hdg,
                c: this.clientId
            };

            this.socket.send(PPUEncode(ppu));
        }
    }
    private getGameId(): string {
        let path = window.location.pathname;
        return URLUtil.GetIdFromPath(path);
    }
    private routeCommand(command: Object, type:string) {
        switch(type){
            case Commands.CCI:
                this.socketConnected(<CCICommand>command);
                break;
            case Commands.PCI:
                for (var key in command["p"]) {
                    if(key == this.clientId) { continue;} //dont add ourselves
                    // skip loop if the property is from prototype
                    if (!command["p"].hasOwnProperty(key)) continue;
                    this.gameworld.addOpponent(key,command["p"][key]);
                }
                break;
            case Commands.PPU:
                this.gameworld.updateOpponent(<PPUCommand>command);
                break;
            case Commands.PJI:
                this.gameworld.addOpponent(command["i"],command["n"]);
                break;
            case Commands.PLI:
                this.gameworld.removeOpponent(command["c"]);
                break;
            default: 
                console.warn("No Match for type:",type);
        }
    }
    private socketOpen(eventData): void {

    }

    private socketDataReceived(message): void {
        let data = message.data;
        //If the first character is an exclamation mark, assume a command
        let command:Object = null;
        let type:string = null;
        if(data[0] === '!') {
            type = data.substring(1,4);
            let decoder = this.commandDecoder[type];
            if(!!decoder) {command = decoder(data);}
        } else if(data[0] === '{') { 
            //if the test start with a brace assume its json
            try{
                let jsonData = JSON.parse(data);
                //It should be wrapped
                if(!!jsonData["t"]){
                    type = jsonData["t"];
                    command = jsonData["d"];
                }
            } catch (e) {
                console.log("Error parsing json message command", e);
            }
        } 
        if(command == null) {
            console.log('Invalid command received:',data);
        } else {
            this.routeCommand(command,type);
        }
    }
    private socketConnected(con: CCICommand) {
        this.clientId = con.c+"";
        console.log("ClientID assigned:",this.clientId);
    }
    private assetLoadError(err): void {
        console.log("Failed loading assets:",err);
    }
    private socketError(err): void {
        //Handle errors differently if we are connected or not
        if(this.socket.readyState != 0) {
            //Handle error while connected
        } else {
            //Error occured during connecting
        }
    }
    private initPointerLock(): void {
        // Request pointer lock
        var canvas = this.webglCanvas;
        canvas.addEventListener("click", function(evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || 
                canvas.msRequestPointerLock || 
                canvas.mozRequestPointerLock || 
                canvas.webkitRequestPointerLock;

            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);

        // Event listener when the pointerlock is updated.
        var pointerlockchange = (event) => {
            this.pointerLock = (document.mozPointerLockElement === canvas || 
                document.webkitPointerLockElement === canvas || 
                document.msPointerLockElement === canvas || 
                document.pointerLockElement === canvas);
            if (!this.pointerLock) {
                this.gameworld.camera.detachControl(canvas);
            } else {
                this.gameworld.camera.attachControl(canvas);
            }
        };
        
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }
}

//Lets start this thing
let game = new Game('renderCanvas');