import { ApiProperty } from '@nestjs/swagger';

const examplePoint = [
    { id: 1, x: 1, y: 1 },
    { id: 2, x: 2, y: 2 },
    { id: 3, x: 3, y: 3 },
];

const examplePoints = [
    {
        _id: '68add69b7dc255b3b6b03f96',
        points: examplePoint,
    },
];

type ExamplePoints = typeof examplePoints;

export class OkGetPointsDocDto {
    @ApiProperty({ example: examplePoints, description: 'User points' })
    userPoints: ExamplePoints[];
}
