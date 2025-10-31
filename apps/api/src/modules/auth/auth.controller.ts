import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser, CurrentUserData } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * POST /auth/register
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);

    // Set refresh token in httpOnly cookie
    this.setRefreshTokenCookie(res, result.tokens.refreshToken);

    return {
      message: 'تم التسجيل بنجاح',
      user: result.user,
      accessToken: result.tokens.accessToken,
      expiresIn: result.tokens.expiresIn,
    };
  }

  /**
   * Login user
   * POST /auth/login
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    // Set refresh token in httpOnly cookie
    this.setRefreshTokenCookie(res, result.tokens.refreshToken);

    return {
      message: 'تم تسجيل الدخول بنجاح',
      user: result.user,
      accessToken: result.tokens.accessToken,
      expiresIn: result.tokens.expiresIn,
    };
  }

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      throw new Error('رمز التحديث غير موجود');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    // Set new refresh token in httpOnly cookie
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      message: 'تم تحديث الرمز بنجاح',
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
    };
  }

  /**
   * Logout user
   * POST /auth/logout
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: CurrentUserData,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await this.authService.logout(user.id, refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return {
      message: 'تم تسجيل الخروج بنجاح',
    };
  }

  /**
   * Get current user profile
   * GET /auth/me
   */
  @UseGuards(JwtAuthGuard)
  @Post('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser() user: CurrentUserData) {
    return {
      user,
    };
  }

  /**
   * Helper: Set refresh token in httpOnly cookie
   */
  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
