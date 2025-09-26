import { ApiProperty } from '@nestjs/swagger';

export class OkSignupDocDto {
    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGQyYmE4NjlmMWRmMTcyNzgxNzI3YmUiLCJpYXQiOjE3NTg5MDY4NjV9.BA-sPBvWXSS6WbR31tawzN858dZ_Sr9F_0H-01sx2UE',
        description: 'JWT token',
    })
    token: string;
}
