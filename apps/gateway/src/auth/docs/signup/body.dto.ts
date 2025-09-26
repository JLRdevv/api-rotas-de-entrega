import { ApiProperty } from '@nestjs/swagger';

export class BodySignupDocDto {
    @ApiProperty({ example: 'valid@email.com', description: 'User email' })
    email: string;

    @ApiProperty({ example: 'superSecret', description: 'User password' })
    password: string;
}
