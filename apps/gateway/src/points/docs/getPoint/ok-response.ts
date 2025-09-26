import { ApiProperty } from '@nestjs/swagger';

type point = { id: 1; x: 1; y: 1 };

const examplePoints = [
    { id: 1, x: 1, y: 1 },
    { id: 2, x: 2, y: 2 },
    { id: 3, x: 3, y: 3 },
];

const examplePoint = {
    _id: '68add69b7dc255b3b6b03f96',
    points: examplePoints,
};

type ExamplePoint = typeof examplePoints;

export class OkGetPointDocDto {
    @ApiProperty({ example: examplePoint, description: 'Specified point' })
    point: ExamplePoint;
}
