import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedLoginDocDto {
    @ApiProperty({
        example: '401',
        description: 'http status code',
    })
    statusCode: string;

    @ApiProperty({
        example: 'Wrong email or password',
        description: 'Error message',
    })
    message: string;
}
