import { IsEmail,IsString,MinLength } from "class-validator";

export class signupDto{
    @IsEmail()
    email:string

    @IsString()
    @MinLength(8)
    password:string
}