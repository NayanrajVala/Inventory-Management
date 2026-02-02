import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { signupDto } from 'src/products/dtos/signup.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { RedisService } from 'src/redis/redis.service';
import { MailService } from 'src/mail/mail.service';
import { otpCheckDto } from 'src/products/dtos/verifyOtp.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UserService,
        private readonly jwtService:JwtService,
        private readonly redisService:RedisService,
        private readonly mailService:MailService
    ){}

    async signup(dto:signupDto){

        const {email,password} = dto;
        const existingUser = await this.userService.findByEmail(dto.email);

        if(existingUser){
            throw new  ConflictException('User already exist');
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await this.userService.create({
            email,
            password:hashedPassword,
            roles:['user'],
            isVerified:false
        });

        const otp = Math.floor(100000+ Math.random()*900000);

        await this.redisService.set(email,otp,300);
        console.log("otp set on redis")
        await this.mailService.sendOtp(email,otp);
        console.log("Mail sent");

        return {
            user:{
                id:user.id,
                email:user.email,
                roles:user.roles
            }
        }
    }

    async verifyOtp(dto:otpCheckDto){
        const {otp,email} = dto;

        const storedOtp =await this.redisService.get(email);

        if(!storedOtp){
            throw new   UnauthorizedException("Otp expired or not found");
        }

        if(storedOtp !=otp){
            throw new UnauthorizedException("Invalid Otp");
        }

        await this.userService.verifyUser(email);

        return "email verified";

    }

    async login(dto:signupDto){
        const{email,password} = dto;
        const user = await this.userService.findByEmail(dto.email);

        if(!user){
            throw new UnauthorizedException('Invalid Credentials');
        }

        if(!user.isVerified){
            throw new UnauthorizedException("You have to verify email first");
        }

        const isPass = await bcrypt.compare(password,user.password);

        if(!isPass){
            throw new UnauthorizedException('Invalid Credentials');
        }

        const payload = {
            sub:user.id,
            email:user.email,
            roles:user.roles
        }

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,user:{
                id:user.id,
                email:user.email,
                roles:user.roles
            }
        }
    }
}
