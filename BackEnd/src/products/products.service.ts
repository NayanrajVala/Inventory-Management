import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dtos/products.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { ProductNotFoundException } from 'src/common/exceptions/productNotFound.exception';

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  lastPage: number;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  private products: CreateProductDto[] = [];
  async findAll(page: number, limit: number,search:string , sortBy:string , order:'asc'|'desc'): Promise<PaginatedProducts> {
    const skip = (page - 1) * limit;

    const where:Prisma.ProductWhereInput = search?{
      name:{
        contains:search,
        mode:'insensitive',
      },
    }:{};
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy:{
          [sortBy]:order}
      }),
      this.prisma.product.count({where}),
    ]);

    return { data, total, page, lastPage: Math.ceil(total / limit) };
    // return await this.prisma.product.findMany();
  }

  async find(quantity: number): Promise<Product | null> {
    return await this.prisma.product.findFirst({ where: { quantity } });
  }

  async create(dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: dto,
      });
    } catch (error) {
      throw error;
      // console.log(error, 'errorss');
    }
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
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

  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
