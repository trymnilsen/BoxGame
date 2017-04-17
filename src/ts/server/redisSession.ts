// import * as Promise from 'bluebird';
import * as winston from 'winston';
import * as Redis from 'ioredis';
import * as Promise from 'bluebird';

// export class RedisSession {
//     private redisClient: redis.Redis;
//     public constructor()
//     {

//     }
//     public connect(): Promise<void> {
//         return new Promise<void>((resolve, reject)=> {
//             this.redisClient = new redis();
//             this.redisClient.on('ready',()=>{
//                 resolve();
//             });
//             this.redisClient.on('error',(error)=> {
//                 reject(error);
//             });
//         });
//     }
//     public set(key:string, value:string): Promise<void> {
//         return new Promise<void>((resolve,reject)=> {
//             if(!this.redisClient.connected)
//             {
//                 reject("Not yet connected");
//             }
//         });
//     }

// }

export function initRedis(): Promise<Redis.Redis> {
    return new Promise<Redis.Redis>((resolve,reject)=> {
        let redisClient = new Redis();
        redisClient.on("ready",()=> {
            resolve(redisClient)
        });
        redisClient.on("error",(error)=> {
            reject(error);
        });
    });
}