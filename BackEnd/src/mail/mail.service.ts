import { BadRequestException, Injectable,Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailService {
    private transporter :nodemailer.Transporter;
      private readonly logger = new Logger(MailService.name)

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
        try{    
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
        catch(error){
            this.logger.error("Error sending otp to mail");
            throw new BadRequestException("error sending otp to mail");
        }
    }

    async sendAttachment(email:string,file:Buffer,filename:string){
        try{
            await this.transporter.sendMail({
                to:email,
                subject:"Copy of file you have uploaded",
                text:"Here is Your Uploaded file",
                attachments:[
                    {
                        filename:filename,
                        content:file,
                    }
                ]
            })
        }
        catch(error){
            this.logger.error("Error sending attachment to mail");
            throw new BadRequestException("Error sending attachment to mail");
        }
    }
}
