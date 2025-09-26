import { ApiProperty } from '@nestjs/swagger';

export class UnprocessableAddPointDocDto {
    @ApiProperty({
        example: '422',
        description: 'http status code',
    })
    statusCode: string;

    @ApiProperty({
        example: 'Points are not unique',
        description: 'Error message',
    })
    message: string;
}
