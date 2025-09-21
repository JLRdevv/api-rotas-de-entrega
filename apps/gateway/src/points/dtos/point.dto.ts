import { IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class PointDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    id: number;

    @IsNotEmpty()
    @IsInt()
    x: number;

    @IsNotEmpty()
    @IsInt()
    y: number;
}
