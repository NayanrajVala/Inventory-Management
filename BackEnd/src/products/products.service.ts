import { BadGatewayException, BadRequestException, Injectable,Logger} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dtos/products.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma} from '@prisma/client';
import { NotFoundException } from "@nestjs/common";
import { PaginatedProducts } from './types/paginated_products.types';
import { findProductsDto } from './dtos/find_products.dto';

export class ProductNotFoundException extends NotFoundException{
    constructor(productId?:string){
        super(
            productId? `Product with id ${productId} not found`:'Product Not Found'
        );
    }
}


@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(ProductsService.name)
  async findAll(
    findProductDto:findProductsDto
  ): Promise<PaginatedProducts> {
    try{
       const page = findProductDto.page
    const limit = findProductDto.limit
    const search = findProductDto.search
    const sortBy= findProductDto.sortBy
    const order= findProductDto.order

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
    catch(error){
      this.logger.error("Error finding all products");
      throw new BadRequestException("Error finding all products");
    }
   
  }

  async create(dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: dto,
      });
    } catch (error) {
      this.logger.error("Product creation failed",error);
      throw new BadRequestException("Error creating product");
    }
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    try{
      const Product = await this.prisma.product.findUnique({ where: { id } });
    if (!Product) {
      throw new ProductNotFoundException();
    }
    return await this.prisma.product.update({
      where: { id },
      data: dto,
    });
    }
    catch(error){
      this.logger.error("Error updating product");
      throw new BadRequestException("Error updating product");
    }
  }

  async deleteProduct(id: string) {
    try{
      return this.prisma.product.delete({
      where: { id },
    });
    }
    catch(error){
      this.logger.error("Error deleting product");
      throw new BadRequestException("Error deleting Product");
    }
    
  }
}
