import { Injectable } from '@nestjs/common';
import { AuthClient } from '../auth/auth.client';
import { PointClient } from '../points/point.client';
import { RouteClient } from '../routes/route.client';

@Injectable()
export class AppService {
    constructor(
        private authClient: AuthClient,
        private pointClient: PointClient,
        private routeClient: RouteClient,
    ) {}

    async health() {
        let [authService, pointsService, routesService] = await Promise.all([
            this.authClient.healthCheck(),
            this.pointClient.healthCheck(),
            this.routeClient.healthCheck(),
        ]);

        let statusCode: number;
        if (authService && pointsService && routesService) {
            statusCode = 200;
        } else if (!authService && !pointsService && !routesService) {
            statusCode = 503;
        } else {
            statusCode = 207;
        }

        return {
            statusCode,
            services: {
                auth_service: authService ? 'Up' : 'Down',
                points_service: pointsService ? 'Up' : 'Down',
                routes_service: routesService ? 'Up' : 'Down',
            },
        };
    }
}
