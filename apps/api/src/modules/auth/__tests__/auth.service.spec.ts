import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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
    role: 'USER',
    organizationId: 'org-123',
    emailVerified: false,
    emailVerifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrganization = {
    id: 'org-123',
    name: 'Test Org',
    slug: 'test-org',
    plan: 'FREE',
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
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      const registerDto = {
        email: 'newuser@example.com',
        password: 'Password123!',
        name: 'New User',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.organization, 'create').mockResolvedValue(mockOrganization);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword123'));

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(mockUser.email);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(prismaService.organization.create).toHaveBeenCalled();
      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      // Arrange
      const registerDto = {
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Existing User',
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
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.organization, 'create').mockResolvedValue(mockOrganization);
      const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);

      // Act
      await service.register(registerDto);

      // Assert
      expect(hashSpy).toHaveBeenCalledWith(registerDto.password, 10);
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
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-jwt-token');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(mockUser.email);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
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
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should generate JWT token with correct payload', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      const signSpy = jest.spyOn(jwtService, 'sign').mockReturnValue('mock-jwt-token');

      // Act
      await service.login(loginDto);

      // Assert
      expect(signSpy).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        organizationId: mockUser.organizationId,
        role: mockUser.role,
      });
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'Password123!';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      // Act
      const result = await service.validateUser(email, password);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(mockUser.email);
    });

    it('should return null if user not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'Password123!';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // Act
      const result = await service.validateUser(email, password);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'WrongPassword!';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      // Act
      const result = await service.validateUser(email, password);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should return user by id', async () => {
      // Arrange
      const userId = '123';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      // Act
      const result = await service.findUserById(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(mockUser.id);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should return null if user not found', async () => {
      // Arrange
      const userId = 'nonexistent';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // Act
      const result = await service.findUserById(userId);

      // Assert
      expect(result).toBeNull();
    });
  });
});
