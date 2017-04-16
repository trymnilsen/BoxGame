import * as HRI from 'human-readable-ids';
import * as redis from 'ioredis';
import * as bluebird from 'bluebird';

export class GameSession {

    public static redisClient: redis.Redis;
    public readonly Id: string;

    private constructor(sessionId: string) {
        this.Id = sessionId;
    }

    public static async sessionExists(id: string): Promise<boolean> {
        return new bluebird<boolean>(async(resolve,reject)=> {
            let exists: boolean = await this.redisClient.exists(id);
            if(exists) {resolve(true);} 
            else {resolve(false);}
        });
    }
    public static async createSession(): Promise<GameSession> {
        //return new GameSession(sessionId);
        console.log("Create session called");
        return new bluebird<GameSession>(async(resolve,reject)=> {
            let validId: string = null;
            console.log("Test");
            do {
                let id: string = HRI.hri.random();
                console.log("trying id:",id);
                let result = await this.redisClient.get(id);
                console.log("Result from redis:",result);
                if(result === null)
                {
                    validId = id;
                }
            } while(false)

            //Add the entry
            console.log("Adding entry");
            await this.redisClient.set(validId,"SESS");
            console.log("resolving promise");
            resolve(new GameSession(validId));
        });
    }

}