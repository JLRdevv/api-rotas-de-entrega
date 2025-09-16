import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsObject,
    ValidateNested,
} from 'class-validator';
import { PointDto } from './point.dto'; 

export class PointsDataDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @Type(() => PointDto)
    points: PointDto[];
}