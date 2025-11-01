import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtPayload, AuthResponse, AuthTokens } from './interfaces/jwt-payload.interface';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Register a new user with organization
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('البريد الإلكتروني مسجل بالفعل');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Generate organization slug from name
    const slug = this.generateSlug(dto.organizationName);

    // Check if slug already exists
    const existingOrg = await this.prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      throw new ConflictException('اسم المنظمة مستخدم بالفعل، يرجى اختيار اسم آخر');
    }

    // Create organization and user in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create organization
      // In development, allow more sites for testing
      const isDevelopment = process.env.NODE_ENV === 'development';
      const defaultMaxSites = isDevelopment ? 10 : 1; // Allow 10 sites in development for testing

      const organization = await tx.organization.create({
        data: {
          name: dto.organizationName,
          slug,
          plan: 'FREE',
          maxSites: defaultMaxSites,
          maxStorage: 100,
        },
      });

      // Create user
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          role: UserRole.USER,
          organizationId: organization.id,
          emailVerified: false, // Will be verified later
        },
      });

      return { user, organization };
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: result.user.id,
      email: result.user.email,
      organizationId: result.organization.id,
      role: result.user.role,
    });

    // Create session
    await this.createSession(result.user.id, tokens.refreshToken);

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        organizationId: result.organization.id,
      },
      tokens,
    };
  }

  /**
   * Login user with email and password
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    // Find user with organization
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    });

    // Create session
    await this.createSession(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
      },
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('رمز التحديث غير صحيح');
      }

      // Check if session exists and is valid
      const session = await this.prisma.session.findFirst({
        where: {
          userId: payload.sub,
          token: refreshToken,
          expiresAt: { gte: new Date() },
        },
      });

      if (!session) {
        throw new UnauthorizedException('الجلسة منتهية أو غير صالحة');
      }

      // Get user to ensure they still exist
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('المستخدم غير موجود');
      }

      // Generate new tokens
      const tokens = await this.generateTokens({
        sub: user.id,
        email: user.email,
        organizationId: user.organizationId,
        role: user.role,
      });

      // Update session with new refresh token
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('رمز التحديث غير صحيح أو منتهي');
    }
  }

  /**
   * Logout user (invalidate session)
   */
  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });
  }

  /**
   * Validate user from JWT payload (used by JwtStrategy)
   */
  async validateUser(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedException('المستخدم غير موجود');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
      organization: user.organization,
    };
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(payload: Omit<JwtPayload, 'type'>): Promise<AuthTokens> {
    const accessTokenExpiry = '15m'; // 15 minutes
    const refreshTokenExpiry = '7d'; // 7 days

    const [accessToken, refreshToken] = await Promise.all([
      // Access token
      this.jwtService.signAsync(
        { ...payload, type: 'access' },
        {
          secret: this.config.get('JWT_SECRET'),
          expiresIn: accessTokenExpiry,
        },
      ),
      // Refresh token
      this.jwtService.signAsync(
        { ...payload, type: 'refresh' },
        {
          secret: this.config.get('JWT_REFRESH_SECRET'),
          expiresIn: refreshTokenExpiry,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  /**
   * Create a session record in database
   */
  private async createSession(userId: string, refreshToken: string): Promise<void> {
    // Clean up expired sessions for this user
    await this.prisma.session.deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() },
      },
    });

    // Create new session
    await this.prisma.session.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
  }

  /**
   * Generate slug from organization name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }
}
