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
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dtos/products.dto';
// import { createProductPipe } from 'src/common/pipes/createProdcut.pipe';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { jwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(jwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(['admin'])
  create(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.productsService.create(dto, req.user);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
  @Get(':id')
  findByQuantity(@Query('quantity', ParseIntPipe) quantity: number) {
    return this.productsService.find(quantity);
  }

  @Patch(':id')
  // @Roles(['admin'])
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    return this.productsService.updateProduct(id, dto, req.user);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct({ id });
  }
}
