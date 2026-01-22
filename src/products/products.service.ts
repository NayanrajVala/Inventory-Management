import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/products.dto';
import { PrismaService } from 'src/prisma.service';
import { PrismaClient } from '@prisma/client';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  private products: CreateProductDto[] = [];
  findAll(): CreateProductDto[] {
    return this.products;
  }

  async create(dto: CreateProductDto) {
    // this.products.push(dto);
    console.log('error');

    try {
      return await this.prisma.product.create({
        data: {
          name: dto.name,
          price: dto.price,
          quantity: dto.quantity,
        },
      });
    } catch (error) {
      console.log(error, 'errorss');
    }
  }
}
