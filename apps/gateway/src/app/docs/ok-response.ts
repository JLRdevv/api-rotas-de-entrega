import { ApiProperty } from '@nestjs/swagger';

export class OkHealthDocDto {
    @ApiProperty({ example: 'Up' })
    auth_service: string;

    @ApiProperty({ example: 'Up' })
    points_service: string;

    @ApiProperty({ example: 'Up' })
    routes_service: string;
}

