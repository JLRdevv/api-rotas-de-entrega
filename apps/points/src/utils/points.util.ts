import type { Point } from '../interfaces/point.interface';

export function validatePointsUniqueness(points: Point[]): boolean {
    const ids = new Set();
    const coords = new Set();
    for (const point of points) {
        ids.add(point.id);
        coords.add(`${point.x},${point.y}`);
    }
    if (ids.size == points.length && coords.size == points.length) return true;
    return false;
}

export function updatePoints(BodyPoints: Point[], DbPoints: Point[]): Point[] {
    const idsMap = new Map<number, Point>();
    for (const p of DbPoints) {
        idsMap.set(p.id, p);
    }

    for (const p of BodyPoints) {
        if (idsMap.has(p.id)) {
            const pointToUpdate = idsMap.get(p.id)!;
            pointToUpdate.x = p.x;
            pointToUpdate.y = p.y;
        } else {
            idsMap.set(p.id, p);
        }
    }

    const result: Point[] = sortIds(Array.from(idsMap.values()));
    return result;
}

export function sortIds(points: Point[]): Point[] {
    return points.sort((a, b) => a.id - b.id);
}
