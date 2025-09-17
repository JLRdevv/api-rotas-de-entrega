import type { SinglePoint } from '@app/contracts';

export function validateStartingPoint(
    points: SinglePoint[],
    startingPointId: number,
): boolean {
    return points.some((point) => point.id === startingPointId);
}
