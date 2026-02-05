import { Controller, Post,Body ,Get,UseGuards} from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CategoryService } from './category.service';
import { createCategoryDto } from './dtos/createCategory.dto';
import { jwtAuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@UseGuards(jwtAuthGuard,RolesGuard)
@Roles([Role.ADMIN])
@ApiTags('Category')
@Controller('category')

export class CategoryController {
    constructor(private categoryService:CategoryService){}

    @Post()
    @ApiOperation({summary:"Create Product Category"})
    @ApiCreatedResponse({description:"Created Successfully"})
    create(@Body() dto:createCategoryDto){
        return this.categoryService.create(dto);
    }

    @Get()
    @ApiOperation({summary:"Find Categories"})
    @ApiOkResponse({description:"Fetched Categories"})
    findAll(){
        // console.log("Category FindAll Hit");
        // return ;
        return this.categoryService.findAll();
    }
}
