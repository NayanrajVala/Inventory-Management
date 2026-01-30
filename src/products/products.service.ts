import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dtos/products.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { ProductNotFoundException } from 'src/common/exceptions/productNotFound.exception';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  private products: CreateProductDto[] = [];
  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }

  async find(quantity: number): Promise<Product | null> {
    return await this.prisma.product.findFirst({ where: { quantity } });
  }

  async create(dto: CreateProductDto,user:{id:string , roles:string[]}) {
    try {
      return await this.prisma.product.create({
        data: {
          name: dto.name,
          price: dto.price,
          quantity: dto.quantity,
          userId:user.id,
        },
      });
    } catch (error) {
      throw error;
      // console.log(error, 'errorss');
    }
  }

  async updateProduct(id: string, dto: UpdateProductDto,user:{id:string, roles:string[]}) {
    console.log('Service Hit');
    const Product = await this.prisma.product.findUnique({ where: { id } });
    if (!Product) {
      throw new ProductNotFoundException();
      // message: 'Product Not Founded',
    }
    return await this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async deleteProduct(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    return await this.prisma.product.delete({
      where,
    });
  }
}
