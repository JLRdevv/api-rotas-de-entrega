import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class DeletePointDto {
    @IsString()
    @IsNotEmpty()
    pointsId: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    pointId: number;
}
