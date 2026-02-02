import { IsEmail,IsString,MinLength,IsInt } from "class-validator";

export class otpCheckDto{
    @IsString()
    email:string
    
    @IsInt()
    otp:number
}