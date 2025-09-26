import { ApiProperty } from '@nestjs/swagger';

export class OkWhoamiDocDto {
    @ApiProperty({
        example: '68add69b7dc255b3b6b03f96',
        description: 'User id',
    })
    _id: string;

    @ApiProperty({ example: 'valid@email.com', description: 'User email' })
    email: string;
}
