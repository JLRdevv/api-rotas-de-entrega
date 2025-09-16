import { Controller, Get, Delete } from '@nestjs/common';
import { RoutesService } from './routes.service';

@Controller('rotas')
export class RoutesController {
    constructor(private routesService: RoutesService) {}

    @Get('/:id')
    getRoute() {
        return this.routesService.getRoute();
    }

    @Get('/:pointsId/:startPointId')
    getRouteWStartPoint() {
        return this.routesService.getRoute();
    }

    @Get('/historico')
    getHistory() {
        return this.routesService.getHistory();
    }

    @Delete('/:routeId')
    deleteRoute() {
        return this.routesService.deleteRoute();
    }
}
