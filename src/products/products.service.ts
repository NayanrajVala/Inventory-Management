import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/products.dto';

@Injectable()
export class ProductsService {
  private products: CreateProductDto[] = [];
  findAll(): CreateProductDto[] {
    return this.products;
  }

  create(dto: CreateProductDto) {
    this.products.push(dto);
    return this.products;
  }
}
