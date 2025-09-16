import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => {
                    if (request?.cookies?.Authentication) {
                        return request.cookies.Authentication;
                    }

                    if (request?.headers['authentication']) {
                        return request.headers['authentication'];
                    }

                    if (request?.headers['authorization']) {
                        const authHeader = request.headers['authorization'];
                        if (authHeader.startsWith('Bearer ')) {
                            return authHeader.slice(7);
                        }
                    }

                    return null;
                },
            ]),
            secretOrKey: config.get<string>('JWT_SECRET')!,
        });
    }

    async validate(payload: JwtPayload) {
        return { userId: payload._id };
    }
}
