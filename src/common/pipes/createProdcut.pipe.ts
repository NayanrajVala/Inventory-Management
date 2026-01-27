// import { BadRequestException,Injectable, PipeTransform } from "@nestjs/common";
// import { CreateProductDto } from "src/products/dtos/products.dto";

// @Injectable()
// export class createProductPipe implements PipeTransform{
//     transform(value:CreateProductDto):CreateProductDto{
//         const {name,price,quantity} = value;

//         if(!name || typeof name !=='string'){
//             throw new BadRequestException('Product name is Required');
//         }

//         const trimmedName = name.trim();
//         if(trimmedName.length ===0){
//             throw new BadRequestException('Product name cannot be empty');
//         }

//         if(typeof price !=='number' || price <=0){
//             throw new BadRequestException('Price should be Positive number');
//         }

//         if(typeof quantity !=='number' || quantity < 0){
//             throw new BadRequestException('Quantity must be Positive Number');
//         }

//         return {
//             name:trimmedName,
//             price,
//             quantity
//         }
//     }

// }