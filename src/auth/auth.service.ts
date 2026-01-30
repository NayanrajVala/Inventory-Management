import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { signupDto } from 'src/products/dtos/signup.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UserService,
        private readonly jwtService:JwtService
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
        });

        // const payload = {
        //     sub:user.id,
        //     email:user.email,
        //     roles:user.roles
        // }

        // const accessToken = this.jwtService.sign(payload);

        return {
            // accessToken,
            user:{
                id:user.id,
                email:user.email,
                roles:user.roles
            }
        }
    }

    async login(dto:signupDto){
        const{email,password} = dto;
        const user = await this.userService.findByEmail(dto.email);

        if(!user){
            throw new UnauthorizedException('Invalid Credentials');
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
