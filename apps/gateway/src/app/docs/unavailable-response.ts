import { ApiProperty } from '@nestjs/swagger';

export class UnavailableHealthDocDto {
    @ApiProperty({ example: 'Down' })
    auth_service: string;

    @ApiProperty({ example: 'Down' })
    points_service: string;

    @ApiProperty({ example: 'Down' })
    routes_service: string;
}

