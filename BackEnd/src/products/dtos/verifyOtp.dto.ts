import { IsEmail, IsString, MinLength, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class otpCheckDto {
  @IsString()
  @ApiProperty({example:"xyz@email.com"})
  email: string;

  @IsString()
  @ApiProperty({example:"123456"})
  otp: string;
}
