import { ApiProperty } from '@nestjs/swagger';

export class UnprocessableGetRouteWSPDocDto {
    @ApiProperty({
        example: '422',
        description: 'http status code',
    })
    statusCode: string;

    @ApiProperty({
        example: 'The provided start point with id ${id} was not found in the list of points.',
        description: 'Error message',
    })
    message: string;
}
