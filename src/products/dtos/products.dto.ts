import {IsInt,IsOptional , IsString,Min,MinLength} from 'class-validator'
import {PartialType} from '@nestjs/mapped-types'
export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;
  
  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  quantity: number;
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