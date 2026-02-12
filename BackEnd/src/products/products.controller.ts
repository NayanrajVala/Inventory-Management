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
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { jwtAuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/common/enums/role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@UseGuards(jwtAuthGuard, RolesGuard)
@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Prodcut' })
  @ApiCreatedResponse({ description: 'Product created successfully' })
  @Roles([Role.ADMIN])
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Prodcuts' })
  @ApiOkResponse({ description: 'Fetched All Prodcuts' })
  findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 5,
    @Query('search') search='',
    @Query('sortBy')sortBy='createdAt',
    @Query('order')order:'asc'|'desc'='desc'
  ) {
    return this.productsService.findAll(page, limit,search,sortBy,order);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Product' })
  @ApiOkResponse({ description: 'Fetched All Prodcuts' })
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Product' })
  @ApiOkResponse({ description: 'Deleted Product' })
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.deleteProduct(id);
  }
}
