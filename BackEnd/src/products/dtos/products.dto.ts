import { IsInt, IsOptional, IsString, Min, MinLength,IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({ example: 'Bicycle' })
  name!: string;

  @IsInt()
  @Min(0)
  @Type(()=>Number)
  @ApiProperty({ example: 5000 })
  price!: number;

  @IsInt()
  @Min(0)
  @Type(()=>Number)
  @ApiProperty({ example: 10 })
  quantity!: number;

  @IsInt()
  @Min(1)
  @Type(()=>Number)
  @ApiProperty({ example: 2 })
  categoryId!: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
