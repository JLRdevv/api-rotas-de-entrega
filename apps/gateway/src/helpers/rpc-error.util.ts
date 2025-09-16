import {
    InternalServerErrorException,
    RequestTimeoutException,
    ServiceUnavailableException,
    UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export function handleRpcError(error: any): never {
    if (error.name === 'TimeoutError') {
        throw new RequestTimeoutException('Service timed out');
    }
    if (error.code === 'ECONNREFUSED') {
        throw new ServiceUnavailableException('Queue not available');
    }
    if (error instanceof RpcException) {
        throw new UnauthorizedException(error.message);
    }
    throw new InternalServerErrorException('Something went wrong');
}
