import { ApiProperty } from '@nestjs/swagger';

type point = { id: 1; x: 1; y: 1 };
const example = [
    { id: 1, x: 1, y: 1 },
    { id: 2, x: 2, y: 2 },
    { id: 3, x: 3, y: 3 },
];

export class OkAddPointsDocDto {
    @ApiProperty({
        example: '68add69b7dc255b3b6b03f96',
        description: 'ObjectId',
    })
    _id: string;

    @ApiProperty({ example, description: 'ObjectId' })
    points: point[];
}
