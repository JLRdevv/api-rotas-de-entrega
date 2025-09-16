import { Injectable } from '@nestjs/common';

@Injectable()
export class RouteOptimizationService {
    getHello(): string {
        return 'Hello World!';
    }
}
