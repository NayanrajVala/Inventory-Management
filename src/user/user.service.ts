import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}
    async findByEmail(email:string){
        return await this.prisma.user.findUnique({
            where:{email}
        });
    }

    async create(data://Prisma.UserCreateInput
        {
        email:string,
        password:string,
        roles:string[],
        isVerified:boolean
        }){
        return this.prisma.user.create({data});
    }

    async verifyUser(email:string){
        return this.prisma.user.update({
            where:{email},
            data:{
                isVerified:true,
            }
        })
    }
}
