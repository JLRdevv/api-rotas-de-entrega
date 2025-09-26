import type { OptimizedRouteResult, SinglePoint } from '@app/contracts';
import { RpcException } from '@nestjs/microservices';

function getEuclideanDistance(
    pointA: SinglePoint,
    pointB: SinglePoint,
): number {
    const deltaX = pointB.x - pointA.x;
    const deltaY = pointB.y - pointA.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function findNearestIndex(
    currentPoint: SinglePoint,
    deliveryPoints: SinglePoint[],
): number {
    let closestIndex = -1;
    let shortestDistance = Infinity;

    deliveryPoints.forEach((point, index) => {
        const distance = getEuclideanDistance(currentPoint, point);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            closestIndex = index;
        }
    });

    return closestIndex;
}

export function optimizeRoute(
    deliveryPoints: SinglePoint[],
    startPointId: number | string,
): OptimizedRouteResult {
    const points = [...deliveryPoints];

    let startingIndex: number;
    if (typeof startPointId != 'string') {
        const startPointIdIndex = points.findIndex(
            (point) => point.id == startPointId,
        );
        if (startPointIdIndex < 0) {
            throw new RpcException({
                statusCode: 400,
                message: `Invalid stating point`,
            });
        }
        startingIndex = startPointIdIndex;
    } else {
        startingIndex = Math.floor(Math.random() * points.length);
    }

    const startingPoint = points[startingIndex];
    let unseenPoints = points.filter((_, index) => index !== startingIndex);

    // * Acumullators
    let totalDistance = 0;
    const optimizedRoute: SinglePoint[] = [startingPoint];

    let currentPoint = startingPoint;

    // * Visiting all points
    while (unseenPoints.length > 0) {
        const indexNextPoint = findNearestIndex(currentPoint, unseenPoints);
        const nextPoint = unseenPoints[indexNextPoint];

        totalDistance += getEuclideanDistance(currentPoint, nextPoint);

        optimizedRoute.push(nextPoint);
        currentPoint = nextPoint;
        unseenPoints = unseenPoints.filter(
            (_, index) => index !== indexNextPoint,
        );
    }

    // * Returning to the starting point
    totalDistance += getEuclideanDistance(currentPoint, startingPoint);
    optimizedRoute.push(startingPoint);

    return {
        optimizedRoute: optimizedRoute.map((point) => point.id),
        totalDistance: parseFloat(totalDistance.toFixed(2)),
    };
}
