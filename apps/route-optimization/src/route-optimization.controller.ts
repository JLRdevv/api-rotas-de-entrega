import { Controller, Get } from '@nestjs/common';
import { RouteOptimizationService } from './route-optimization.service';

@Controller()
export class RouteOptimizationController {
  constructor(private readonly routeOptimizationService: RouteOptimizationService) {}

  @Get()
  getHello(): string {
    return this.routeOptimizationService.getHello();
  }
}
