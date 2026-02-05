import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { createCategoryDto } from './dtos/createCategory.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma:PrismaService){}

    async create(dto:createCategoryDto){
        return await this.prisma.category.create({
            data:dto
        })
    }

    async  findAll(){
        return await this.prisma.category.findMany({
            orderBy:{name:'asc'}
        });
    }
}
