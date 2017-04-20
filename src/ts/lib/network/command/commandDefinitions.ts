export interface Orientation {
    /**
     * X coordinate in worldspace
     * 
     * @type {number}
     * @memberOf Orientation
     */
    x: number;
    /**
     * Y Coordinate in worldspace
     * 
     * @type {number}
     * @memberOf Orientation
     */
    y: number;
    /**
     * Z coordinate in worldspace
     * 
     * @type {number}
     * @memberOf Orientation
     */
    z: number;
    /**
     * Heading in worldspace
     * 
     * @type {number}
     * @memberOf Orientation
     */
    h: number;
}

/**
 * Connected command
 * 
 * @export
 * @interface CONCommand
 */
export interface CONCommand {
    /**
     * The connection id assigned to the client
     * 
     * The CON - connection id is sent from the server to the client on connect
     * 
     * @type {number}
     * @memberOf CONCommand
     */
    c: number;
}
/**
 * The current positon and heading of a player
 * 
 * Position update command, sent from the client to the server each tick
 * 
 * @export
 * @interface PPUCommand
 * @extends {Orientation}
 */
export interface PPUCommand extends Orientation {
    /**
     * Client id
     * 
     * @type {number}
     * @memberOf PPUCommand
     */
    c: string;
}

/**
 * Host Create World request
 * 
 * A request from the server that the first person to connect should be responsible for creating the world
 * I.E placing the boxes randomly, sent as the reply to a HRS (Host responsiblity) command
 * 
 * @export
 * @interface HCWCommand
 */
export interface HCWCommand {
    /**
     * An array of orientation for all boxes in the scene
     * 
     * @type {Array<Orientation>}
     * @memberOf HCWCommand
     */
    b: Array<Orientation>;
}

/**
 * Player joined command
 * 
 * @export
 * @interface PJICommand
 * @extends {PLICommand}
 */
export interface PJICommand extends PLICommand{
    /**
     * Name of the player joining
     * 
     * @type {string}
     * @memberOf PJICommand
     */
    n: string;
}
/**
 * Player left command
 * 
 * @export
 * @interface PLICommand
 */
export interface PLICommand {
    /**
     * Client id of the player joining
     * 
     * @type {number}
     * @memberOf PLICommand
     */
    i: number;
}
/**
 * Player Shooting information
 * 
 * @export
 * @interface PSICommand
 */
export interface PSICommand {
    /**
     * Id of the player shooting
     * 
     * @type {number}
     * @memberOf PSICommand
     */
    i: number;
    /**
     * The heading at the point of firing (combined with pitch gives the velocity of the projectile)
     * 
     * @type {number}
     * @memberOf PSICommand
     */
    h: number;
    /**
     * The pitch of the player/weapon at the time of shooting ((combined with heading gives the velocity of the projectile )
     * 
     * @type {number}
     * @memberOf PSICommand
     */
    p: number;
}

/**
 * Player ability activated command
 * 
 * @export
 * @interface PAACommand
 */
export interface PAACommand {
    /**
     * Id of player that activated a ability
     * 
     * @type {number}
     * @memberOf PAACommand
     */
    i: number;
    /**
     * Integer id of the ability that was triggered
     * 
     * @type {number}
     * @memberOf PAACommand
     */
    a: number;
}
/**
 * Player Hit command
 * 
 * Player hit another player, from client to server
 * TODO: Implement server side
 * 
 * @export
 * @interface PHICommand
 */
export interface PHICommand {
    /**
     * the target client that was hit
     * 
     * @type {number}
     * @memberOf PHICommand
     */
    t:number;
}
/**
 * Player Damage Info
 * 
 * A player was damaged
 * 
 * @export
 * @interface PDICommand
 */
export interface PDICommand {
    /**
     * The client id inflicted with damage
     * 
     * @type {number}
     * @memberOf PDICommand
     */
    i: number;
    /**
     * The amount of damage
     * 
     * @type {number}
     * @memberOf PDICommand
     */
    d: number;
    /**
     * The global direction the damage source is located at
     * 
     * Optional
     * 
     * @type {number}
     * @memberOf PDICommand
     */
    h?: number; 
}

/**
 * Player kill info, sent from server to clients
 * 
 * @export
 * @interface PKICommand
 */
export interface PKICommand {
    /**
     * The source, I.E who got the kill
     * 
     * @type {number}
     * @memberOf PKI
     */
    s: number;
    /**
     * The target, I.E who got the kill
     * 
     * @type {number}
     * @memberOf PKI
     */
    t: number;

    /**
     * 
     * 
     * @type {number}
     * @memberOf PKI
     */
    b: number;
}

export interface PCICommand {
    p: {[id:number] : string};
}