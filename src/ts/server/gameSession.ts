import * as HRI from 'human-readable-ids';
import * as redis from 'ioredis';
import * as bluebird from 'bluebird';
import * as winston from 'winston';

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
        winston.debug("GameSession::createSession() Called");
        return new bluebird<GameSession>(async(resolve,reject)=> {
            let validId: string = null;
            let attempts: number = 0;
            do {
                //Generate a new id
                let id: string = HRI.hri.random();
                winston.debug("Got HRI:"+id);
                //Fetch it from redis
                let exists: boolean = await this.redisClient.exists(id);
                winston.debug("Id Exists in redis:",!!exists);
                if(exists == false) { validId = id; }
                else {attempts++;}
            } while(validId === null && attempts<100)
            if(validId === null) {reject();}
            else {
                //Add the entry
                winston.debug("Adding entry to redis");
                await this.redisClient.set(validId,"SESS");
                resolve(new GameSession(validId));           
            }
        });
    }

}