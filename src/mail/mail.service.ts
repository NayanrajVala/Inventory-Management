import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailService {
    private transporter :nodemailer.Transporter;

    constructor(){
        this.transporter =nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            },
        });
    }

    async sendOtp(email:string,otp:number){
        await this.transporter.sendMail({
            to:email,
            subject:"Otp Verification ",
            html:
                `<h2>Email Verification  </h2>
                <p>Your otp is: </p>
                <h1>${otp}</h1>
                <p>Your otp will expire in 5 minutes.</p>`
        });
    }
}
