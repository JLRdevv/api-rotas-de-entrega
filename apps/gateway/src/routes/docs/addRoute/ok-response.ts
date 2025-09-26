import { type Route } from '@app/contracts';
import { ApiProperty } from '@nestjs/swagger';

const exampleRoute = {
    _id: '68add69b7dc255b3b6b03f96',
    results: {
        optimizedRoute: [1, 2, 3, 1],
        totalDistance: 10,
    },
    date: new Date().toISOString(),
    pointsId: '68add69b7dc255b3b6b03f96',
};

export class OkGetRouteDocDto {
    @ApiProperty({ example: exampleRoute, description: 'Calculated route' })
    route: Route;
}
