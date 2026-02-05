import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private client :Redis;

    constructor(){
    this.client = new Redis({
        host:"127.0.0.1",
        port:6379.
    });

    this.client.on('connect',()=>{
        console.log("Redis Connected successfully");
    });
    }

    async set(key: string , otp:number , expTime:number){
        const value = otp.toString();

        if(expTime){
            return this.client.set(key,value,'EX',expTime);
        }

        return this.client.set(key,value);
    }

    async get(key:string):Promise<string |null>{

        const value = await this.client.get(key);

        if(!value){
            return null;
        }
        return value;
    }

    async delete(key:string){
        return this.client.del(key);
    }
}
