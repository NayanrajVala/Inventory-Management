import { Controller, Post ,Body,Redirect} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from 'src/products/dtos/signup.dto';
import { otpCheckDto } from 'src/products/dtos/verifyOtp.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('signup')
    @ApiOperation({summary:"SignUp" })
    @ApiCreatedResponse({description:"SignUp Successfull"})
    async signup(@Body() dto:signupDto){
            await this.authService.signup(dto) ;
            return;       
    }

    @Post('verify-otp')
    @ApiOperation({summary:"Otp Verification"})
    @ApiCreatedResponse({description:"Otp Verified"})
        async verifyOtp(@Body() dto:otpCheckDto){
           return await this.authService.verifyOtp(dto);
        }
    @Post('login')
    @ApiOperation({summary:"Login"})
    @ApiCreatedResponse({description:"Login Successfull"})
    async login(@Body()dto :signupDto){
        // console.log(await this.authService.login(dto));
        return this.authService.login(dto);
        
    }
}
