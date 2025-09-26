import { Type } from 'class-transformer';
import {
    IsInt,
    IsString,
    IsOptional,
    Min,
    ArrayMaxSize,
} from 'class-validator';
import {
    IsObjectId,
    IsValidDate,
    isDateArrayValid,
    TransformToArray,
} from './validation-decorators';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class HistoryQueryParamsDto {
    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number = 20;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number = 0;

    @ApiPropertyOptional({
        example: ['dd-mm-yyyy', 'dd-mm-yyyy'],
        type: [String],
        items: { type: 'string', example: '22-03-2025' },
        description: 'Filter by date or date range (1 or 2 dates)',
    })
    @IsOptional()
    @IsValidDate()
    @isDateArrayValid()
    @TransformToArray()
    date?: string[];

    @ApiPropertyOptional({ example: '68b48a08400b59f916e64d7e' })
    @IsOptional()
    @IsString()
    @IsObjectId()
    pointsId?: string;
}
