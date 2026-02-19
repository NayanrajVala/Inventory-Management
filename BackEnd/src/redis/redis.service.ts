import { BadRequestException, Injectable,Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly logger = new Logger(RedisService.name)
    private client :Redis;

    constructor(){
    this.client = new Redis({
        host:"127.0.0.1",
        port:6379.
    });
    try{
        this.client.on('connect',()=>{
        console.log("Redis Connected successfully");
    });
    }
    catch(error){
        this.logger.error("Error Connecting Redis");
    }
    }

    async set(key: string , otp:number , expTime:number){
        try{
            const value = otp.toString();

        if(expTime){
            return this.client.set(key,value,'EX',expTime);
        }

        return this.client.set(key,value);
        }
        catch(error){
            this.logger.error("Error setting otp on redis");
            throw new BadRequestException("Error setting otp on redis");
        }
        
    }

    async get(key:string):Promise<string |null>{
        try{
            const value = await this.client.get(key);

        if(!value){
            return null;
        }
        return value;
        }
        catch(error){
            this.logger.error("Error getting otp from redis");
            throw new BadRequestException("Error getting otp from redis");
        }   
    }

    async delete(key:string){
        try{
            return this.client.del(key);
        }
        catch(error){
            this.logger.error("Error deleting from redis");
            throw new BadRequestException("Error deleting from redis");
        }
        
    }
}
