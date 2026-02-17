import { Injectable,Logger} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dtos/products.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { NotFoundException } from "@nestjs/common";

export class ProductNotFoundException extends NotFoundException{
    constructor(productId?:string){
        super(
            productId? `Product with id ${productId} not found`:'Product Not Found'
        );
    }
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  lastPage: number;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(ProductsService.name)
  async findAll(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    order: Prisma.SortOrder,
  ): Promise<PaginatedProducts> {
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : {};
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        include: {
          category: true,
        },
        orderBy: {
          [sortBy]: order,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async create(dto: CreateProductDto) {
    try {
      this.logger.log('Creating Product')
      return await this.prisma.product.create({
        data: dto,
      });
    } catch (error) {
      this.logger.error("Product creation failed");
      throw error;
    }
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const Product = await this.prisma.product.findUnique({ where: { id } });
    if (!Product) {
      throw new ProductNotFoundException();
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
