import { RpcException } from '@nestjs/microservices';

export function handleRpcError(error: any, defaultMessage: string): never {
    if (
        error &&
        typeof error === 'object' &&
        'statusCode' in error &&
        'message' in error
    ) {
        const typedError = error as { statusCode: number; message: string };
        throw new RpcException({
            statusCode: typedError.statusCode,
            message: typedError.message,
        });
    }

    throw new RpcException({
        statusCode: 500,
        message: defaultMessage,
    });
}
