import { Injectable } from '@nestjs/common';
import { RouteClient } from './route.client';
import { historyFilters } from '@app/contracts';

@Injectable()
export class RoutesService {
    constructor(private routeClient: RouteClient) {}

    async getRoute(userId: string, pointsId: string, pointId?: number) {
        if (pointId)
            return await this.routeClient.addRouteWithStartingPoint(
                pointsId,
                userId,
                pointId,
            );
        return await this.routeClient.addRoute(pointsId, userId);
    }

    async getHistory(userId: string, filters: historyFilters) {
        return await this.routeClient.getHistory(userId, filters);
    }

    async deleteRoute(userId: string, routeId: string) {
        return await this.routeClient.deleteRoute(userId, routeId);
    }
}
