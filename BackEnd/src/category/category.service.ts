import { BadRequestException, Injectable,Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { createCategoryDto } from './dtos/createCategory.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma:PrismaService){}
      private readonly logger = new Logger(CategoryService.name);
    

    async create(dto:createCategoryDto){
        try{
            return await this.prisma.category.create({
            data:dto
        })
        }
        catch(error){
            this.logger.error("Error creating category");
            throw new BadRequestException("Error creating category");
        }
    }

    async  findAll(){
        try{
            return await this.prisma.category.findMany({
            orderBy:{name:'asc'}
        });
        }
        catch(error){
            this.logger.error("Error finding all category");
            throw new BadRequestException("Error finding all category");
        }
    }
}
