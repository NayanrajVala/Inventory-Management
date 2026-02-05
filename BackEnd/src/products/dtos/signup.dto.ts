import { IsEmail,IsString,MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class signupDto{
    @IsEmail()
    @ApiProperty({example:"xyz@email.com"})
    email:string

    @IsString()
    @MinLength(8)
    @ApiProperty({example:"123xyz456"})
    password:string
}