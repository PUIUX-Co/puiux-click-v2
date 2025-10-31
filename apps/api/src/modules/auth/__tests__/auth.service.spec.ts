import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt at module level
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  // Mock data
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    role: 'USER' as any,
    organizationId: 'org-123',
    emailVerified: false,
    emailVerifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    organization: {
      id: 'org-123',
      name: 'Test Org',
      slug: 'test-org',
      plan: 'FREE' as any,
      maxSites: 1,
      maxStorage: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const mockOrganization = {
    id: 'org-123',
    name: 'Test Org',
    slug: 'test-org',
    plan: 'FREE' as any,
    maxSites: 1,
    maxStorage: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            organization: {
              create: jest.fn(),
            },
            session: {
              create: jest.fn(),
              deleteMany: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback({
              organization: {
                create: jest.fn().mockResolvedValue(mockOrganization),
              },
              user: {
                create: jest.fn().mockResolvedValue(mockUser),
              },
            })),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret';
              if (key === 'JWT_EXPIRATION') return '1d';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      const registerDto = {
        email: 'newuser@example.com',
        password: 'Password123!',
        name: 'New User',
        organizationName: 'New Org',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock-token');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      // Arrange
      const registerDto = {
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Existing User',
        organizationName: 'Org',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });

    it('should hash the password before storing', async () => {
      // Arrange
      const registerDto = {
        email: 'newuser@example.com',
        password: 'PlainPassword123!',
        name: 'New User',
        organizationName: 'New Org',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock-token');

      // Act
      await service.register(registerDto);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock-jwt-token');
      jest.spyOn(prismaService.session, 'create').mockResolvedValue({} as any);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(mockUser.email);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        include: { organization: true },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should generate JWT tokens with correct payload', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      const signAsyncSpy = jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock-jwt-token');
      jest.spyOn(prismaService.session, 'create').mockResolvedValue({} as any);

      // Act
      await service.login(loginDto);

      // Assert
      expect(signAsyncSpy).toHaveBeenCalled();
      // Check that tokens were generated (called twice for access + refresh)
      expect(signAsyncSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('validateUser', () => {
    it('should return user if payload is valid', async () => {
      // Arrange
      const payload = {
        sub: '123',
        email: 'test@example.com',
        organizationId: 'org-123',
        role: 'USER' as any,
        type: 'access' as any,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      // Act
      const result = await service.validateUser(payload);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(mockUser.email);
      expect(result.id).toBe(mockUser.id);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      const payload = {
        sub: 'nonexistent',
        email: 'test@example.com',
        organizationId: 'org-123',
        role: 'USER' as any,
        type: 'access' as any,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(service.validateUser(payload)).rejects.toThrow(UnauthorizedException);
    });
  });
});
