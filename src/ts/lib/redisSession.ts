// import * as redis from 'ioredis';
// import * as Promise from 'bluebird';

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