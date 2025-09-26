import { ApiProperty } from '@nestjs/swagger';

export class ConflictSignupDocDto {
    @ApiProperty({
        example: '409',
        description: 'http status code',
    })
    statusCode: string;

    @ApiProperty({
        example: 'Email already in use',
        description: 'Error message',
    })
    message: string;
}
