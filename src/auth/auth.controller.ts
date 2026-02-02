import { Controller, Post ,Body,Redirect} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from 'src/products/dtos/signup.dto';
import { otpCheckDto } from 'src/products/dtos/verifyOtp.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('signup')
    // @Redirect("/auth/login",302)
        async signup(@Body() dto:signupDto){
            await this.authService.signup(dto) ;
            return;       
    }

    @Post('verify-otp')
        async verifyOtp(@Body() dto:otpCheckDto){
           return await this.authService.verifyOtp(dto);
        }
    @Post('login')
    async login(@Body()dto :signupDto){
        console.log(await this.authService.login(dto));
        return;
    }
}
