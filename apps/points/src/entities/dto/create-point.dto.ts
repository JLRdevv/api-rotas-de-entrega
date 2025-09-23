import {
    IsNotEmpty,
    IsNumber,
    IsObject,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CoordinatesDto {
    @IsNumber()
    @IsNotEmpty()
    x: number;

    @IsNumber()
    @IsNotEmpty()
    y: number;
}

export class CreatePointDto {
    @IsNotEmpty()
    name: string;

    @IsObject()
    @ValidateNested()
    @Type(() => CoordinatesDto)
    coordinates: CoordinatesDto;
}
