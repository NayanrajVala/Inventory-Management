import { Controller, Post, Get, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}
