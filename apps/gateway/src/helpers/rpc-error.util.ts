import {
    InternalServerErrorException,
    RequestTimeoutException,
    ServiceUnavailableException,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
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
        const rpcError = error.getError();

        if (
            typeof rpcError === 'object' &&
            rpcError &&
            'statusCode' in rpcError
        ) {
            const statusCode = (rpcError as any).statusCode;
            const message = (rpcError as any).message;

            switch (statusCode) {
                case 400:
                    throw new BadRequestException(message || 'Bad Request');
                case 401:
                    throw new UnauthorizedException(message || 'Unauthorized');
                case 409:
                    throw new ConflictException(message || 'Conflict');
                default:
                    throw new InternalServerErrorException(
                        message || 'Internal Server Error',
                    );
            }
        }

        throw new UnauthorizedException(error.message);
    }

    if (error.status || error.statusCode) {
        throw error;
    }

    throw new InternalServerErrorException(
        error.message || 'Something went wrong',
    );
}
