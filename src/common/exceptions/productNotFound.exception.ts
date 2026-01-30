import { NotFoundException } from "@nestjs/common";

export class ProductNotFoundException extends NotFoundException{
    constructor(productId?:string){
        super(
            productId? `Product with id ${productId} not found`:'Product Not Found'
        );
    }
}