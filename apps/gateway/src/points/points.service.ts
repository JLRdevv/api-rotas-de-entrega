import { Injectable } from '@nestjs/common';
import { Point } from '@app/contracts';
import { PointClient } from './point.client';

@Injectable()
export class PointsService {
    constructor(private pointClient: PointClient) {}

    async insertPoints(points: Point[], userId: string) {
        return await this.pointClient.addPoints(userId, points);
    }

    async getPoints(userId: string) {
        return await this.pointClient.getPoints(userId);
    }

    async getPoint(userId: string, pointsId: string) {
        return await this.pointClient.getPoint(userId, pointsId);
    }

    async patchPoints(userId: string, pointsId: string, points: Point[]) {
        return await this.pointClient.patchPoints(userId, pointsId, points);
    }

    async deletePoints(userId: string, pointsId: string) {
        return await this.pointClient.deletePoints(userId, pointsId);
    }

    async deletePoint(userId: string, pointsId: string, pointId: number) {
        return await this.pointClient.deletePoint(userId, pointsId, pointId);
    }
}
