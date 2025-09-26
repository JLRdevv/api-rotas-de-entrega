import { ApiProperty } from '@nestjs/swagger';

export class MultiHealthDocDto {
    @ApiProperty({ example: 'Up' })
    auth_service: string;

    @ApiProperty({ example: 'Down' })
    points_service: string;

    @ApiProperty({ example: 'Up' })
    routes_service: string;
}

