import {IsInt,IsOptional , IsString,Min,MinLength} from 'class-validator'
// import {PartialType} from '@nestjs/mapped-types'
import { ApiProperty,PartialType } from '@nestjs/swagger';
export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({example:"Bicycle"})
  name: string;
  
  @IsInt()
  @Min(0)
  @ApiProperty({example:5000})
  price: number;

  @IsInt()
  @Min(0)
  @ApiProperty({example:10})
  quantity: number;

  @IsInt()
  @Min(1)
  @ApiProperty({example:2})
  categoryId:number;
}

export class UpdateProductDto extends PartialType(CreateProductDto){}
//Partial Type creates duplicate of class but makes every field optional
// export class UpdateProductDto{
//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   quantity?:number;

//   @IsOptional()
//   @IsString()
//   @MinLength(1)
//   name?:string;

//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   price?:number;
// }

