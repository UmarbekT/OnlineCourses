import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/jwt-local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/jwt.refresh.guard';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { Response, Request } from 'express';
import { User } from '../users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterAuthDto, @Res() res: Response) {
    try {
      const result = await this.authService.register(dto, res);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (err) {
      console.error('Registration error:', err);
      return res
        .status(err?.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || 'Registration failed' });
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request & { user: User },
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.login(req.user, res);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      console.error('Login error:', err);
      return res
        .status(err?.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || 'Login failed' });
    }
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request & { cookies: { refresh_token: string } },
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.refreshTokens(
        req.cookies.refresh_token,
        res,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Token refreshed successfully', ...result });
    } catch (err) {
      console.error('Refresh token error:', err);
      return res
        .status(err?.status || HttpStatus.UNAUTHORIZED)
        .json({ message: err?.message || 'Invalid refresh token' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    try {
      const result = this.authService.logout(res);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      console.error('Logout error:', err);
      return res
        .status(err?.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || 'Logout failed' });
    }
  }
}
