import {IsString, MaxLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createCategoryDto{
    @IsString()
    @MaxLength(20)
    @ApiProperty({example:"Vehicle"})
    name:string;
}