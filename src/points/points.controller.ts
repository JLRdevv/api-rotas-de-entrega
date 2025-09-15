import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PointService } from './point.service'
import { CreatePointDto } from './dto/create-point.dto'

@Controller()
export class PointsController {
    constructor(private readonly pointsService: PointService) {}

    @MessagePattern({ cmd: 'create-point' })
    async createPoint(@Payload() createPointDto: CreatePointDto) {
        return this.pointsService.create(createPointDto)
    }

    @MessagePattern({ cmd: 'get-points-by-id' })
    async getPointsById(@Payload('id') id: string) {
        return this.pointsService.findById(id)
    }
}