import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}
    async findByEmail(email:string){
        return await this.prisma.user.findUnique({
            where:{email}
        });
    }

    async create(data:{
        email:string,
        password:string,
        roles:string[]
    }){
        return this.prisma.user.create({data});
    }
}
