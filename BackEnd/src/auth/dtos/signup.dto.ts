import { IsEmail,IsString,MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';

export class signupDto{
    @IsEmail()
    @Transform(({value})=>value.trim())
    @ApiProperty({example:"xyz@email.com"})
    email!:string

    @IsString()
    @MinLength(8)
    @Transform(({value})=>value.trim())
    @ApiProperty({example:"123xyz456"})
    password!:string
}