import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { userRole } from '../enums/user-role.enum';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { TokenPayload } from '../shared/interfaces/token-payload.interface';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterAuthDto, response: Response) {
    try {
      const existingUser = await this.usersService.findByEmail(
        registerUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException("Bu email allaqachon ro'yxatdan o'tgan");
      }

      const user = await this.usersService.create({
        username: registerUserDto.username,
        email: registerUserDto.email,
        password: registerUserDto.password,
        role: registerUserDto.role || userRole.STUDENT,
      });

      return await this.generateAndSetTokens(user, response);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException("Bu email allaqachon ro'yxatdan o'tgan");
      }
      console.error('Error during registration:', error);
      throw new InternalServerErrorException("Ro'yxatdan o'tishda xatolik");
    }
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
    }
    return user;
  }

  async login(loginDto: LoginDto, response: Response) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      return await this.generateAndSetTokens(user, response);
    } catch (error) {
      console.error('Error during login:', error);
      throw new InternalServerErrorException(
        'Login jarayonida xatolik yuz berdi',
      );
    }
  }

  /**
   * Universal function: token yaratadi, cookie ga yozadi, response qaytaradi
   */
  private async generateAndSetTokens(user: User, response: Response) {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role || userRole.STUDENT,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
    console.log('refreshTOKEN', refreshToken);

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: this.configService.get<number>('JWT_ACCESS_EXPIRES_IN_MS'),
      sameSite: 'strict',
      secure: this.configService.get<string>('NODE_ENV') === 'production',
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: this.configService.get<number>('JWT_REFRESH_EXPIRES_IN_MS'),
      sameSite: 'strict',
      secure: this.configService.get<string>('NODE_ENV') === 'production',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async refreshTokens(refreshToken: string, response: Response) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new BadRequestException('Foydalanuvchi topilmadi');
      }
      const tokens = await this.generateAndSetTokens(user, response);
      console.log('REFRESH TOKENS-- ', tokens);

      return tokens;
    } catch (error) {
      console.log('Error refreshing tokens:', error);
      throw new UnauthorizedException('Yaroqsiz yoki muddati otgan token');
    }
  }

  logout(response: Response) {
    try {
      response.clearCookie('access_token');
      response.clearCookie('refresh_token');
      return { message: 'Muvaffaqiyatli chiqish' };
    } catch (error) {
      console.error('Logout error:', error);
      throw new InternalServerErrorException(
        'Chiqish jarayonida xatolik yuz berdi',
      );
    }
  }
}
