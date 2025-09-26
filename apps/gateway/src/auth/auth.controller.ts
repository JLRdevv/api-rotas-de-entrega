import {
    Controller,
    Post,
    Body,
    Res,
    Get,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { userDataDto } from './dtos/user-data.dto';
import { type Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserId } from './decorators/current-user.decorator';
import {
    ApiBody,
    ApiConflictResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { BodySignupDocDto } from './docs/signup/body.dto';
import { OkSignupDocDto } from './docs/signup/ok-response';
import { ConflictSignupDocDto } from './docs/signup/conflict-response';
import { UnauthorizedLoginDocDto } from './docs/login/unauthorized-response';
import { OkWhoamiDocDto } from './docs/whoami/ok-response';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @ApiOperation({ summary: 'Creates user credentials' })
    @ApiOkResponse({
        type: OkSignupDocDto,
        description: 'User account created',
    })
    @ApiConflictResponse({
        type: ConflictSignupDocDto,
        description: 'If user tries to use an non unique email',
    })
    @ApiBody({ type: BodySignupDocDto })
    @Post('/signup')
    async signup(
        @Body() body: userDataDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = await this.authService.signup(body.email, body.password);
        if (token) {
            res.cookie('Authentication', token, {
                httpOnly: true,
            });
            return { token };
        }
    }

    @ApiOperation({ summary: 'Logs in user' })
    @ApiOkResponse({
        type: OkSignupDocDto,
        description: 'User logged in with sucess',
    })
    @ApiConflictResponse({
        type: UnauthorizedLoginDocDto,
        description: 'If email or password dont match',
    })
    @ApiBody({ type: BodySignupDocDto })
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() body: userDataDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = await this.authService.login(body.email, body.password);
        if (token) {
            res.cookie('Authentication', token, {
                httpOnly: true,
            });
            return { token };
        }
    }

    @ApiOperation({ summary: 'Logs out user' })
    @ApiOkResponse({ description: 'Clears user cookie' })
    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('Authentication', {
            httpOnly: true,
        });
        return true;
    }

    @ApiOperation({ summary: 'Returns user id and email' })
    @ApiOkResponse({ type: OkWhoamiDocDto })
    @UseGuards(JwtAuthGuard)
    @Get('/whoami')
    async whoami(@UserId() userId: string) {
        return await this.authService.whoami(userId);
    }
}
