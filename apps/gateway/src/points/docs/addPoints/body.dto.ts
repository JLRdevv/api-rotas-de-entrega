import { ApiProperty } from '@nestjs/swagger';

type point = { id: 1; x: 1; y: 1 };

const example = [
    { id: 1, x: 1, y: 1 },
    { id: 2, x: 2, y: 2 },
    { id: 3, x: 3, y: 3 },
];

export class bodyAddPointsDocDto {
    @ApiProperty({ example, description: 'Points object array' })
    points: point[];
}
