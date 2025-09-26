import { ExceptionFilter, Catch } from '@nestjs/common';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown) {
        if (exception instanceof RpcException) {
            return throwError(() => exception);
        } else if (exception instanceof Error) {
            return throwError(() => new RpcException(exception.message));
        } else {
            return throwError(() => new RpcException('Unexpected error'));
        }
    }
}
