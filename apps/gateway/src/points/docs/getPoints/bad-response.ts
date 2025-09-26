import { ApiProperty } from '@nestjs/swagger';

export class BadGetPointsDocDto {
    @ApiProperty({
        example: '400',
        description: 'http status code',
    })
    statusCode: string;

    @ApiProperty({
        example: 'Invalid ID format received: ${id}',
        description: 'Error message',
    })
    message: string;
}
