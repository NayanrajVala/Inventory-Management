import {IsInt,IsOptional,Min,IsString,IsIn} from 'class-validator';
import {Transform,Type} from 'class-transformer'

export class findProductsDto{
    @IsInt()
    @IsOptional()
    @Type(()=>Number)
    @Min(1)
    page:number=1

    @IsInt()
    @IsOptional()
    @Type(()=>Number)
    @Min(5)
    limit:number = 5

    @IsString()
    @IsOptional()
    @Transform(({value})=>value.trim())
    search:string = ''

    @IsOptional()
    @IsString()
    @Transform(({value})=>value.trim())
    sortBy:string="createdAt"

    @IsOptional()
    @IsIn(['asc','desc'])
    @Transform(({value})=>value.trim())
    order:'asc'|'desc' ='desc';
}