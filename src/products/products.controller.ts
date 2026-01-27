import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Query,
  Delete,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dtos/products.dto';
// import { createProductPipe } from 'src/common/pipes/createProdcut.pipe';

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
  @Get(':id')
  findByQuantity(@Query('quantity',ParseIntPipe)quantity : number){
    return this.productsService.find(quantity);
  }

  @Patch(':id')
  updateProduct(@Param('id',ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct({ id });
  }
}
