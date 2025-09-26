import { ApiProperty } from '@nestjs/swagger';

export class NotFoundGetPointDocDto {
    @ApiProperty({
        example: '404',
        description: 'http status code',
    })
    statusCode: string;

    @ApiProperty({
        example: 'No registers found with ${id}',
        description: 'Error message',
    })
    message: string;
}
