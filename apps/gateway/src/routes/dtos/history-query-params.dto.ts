import { Type } from 'class-transformer';
import { IsInt, IsString, IsOptional, Min } from 'class-validator';
import {
    IsObjectId,
    IsValidDate,
    isDateArrayValid,
    TransformToArray,
} from './validation-decorators';

export class HistoryQueryParamsDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number = 20;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number = 0;

    @IsOptional()
    @IsValidDate()
    @isDateArrayValid()
    @TransformToArray()
    date?: string[];

    @IsOptional()
    @IsString()
    @IsObjectId()
    pointsId?: string;
}
