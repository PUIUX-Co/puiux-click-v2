import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from '../ai.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { AIProvider, ContentType } from '../dto';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk');
// Mock OpenAI SDK
jest.mock('openai');
// Mock axios
jest.mock('axios');

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import axios from 'axios';

const mockedAnthropic = Anthropic as jest.MockedClass<typeof Anthropic>;
const mockedOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AiService', () => {
  let service: AiService;
  let configService: ConfigService;

  const mockAnthropicInstance = {
    messages: {
      create: jest.fn(),
    },
  };

  const mockOpenAIInstance = {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    // Setup mocks BEFORE creating the service
    mockedAnthropic.mockImplementation(() => mockAnthropicInstance as any);
    mockedOpenAI.mockImplementation(() => mockOpenAIInstance as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, any> = {
                ANTHROPIC_API_KEY: 'test-anthropic-key',
                OPENAI_API_KEY: 'test-openai-key',
                UNSPLASH_ACCESS_KEY: 'test-unsplash-key',
                ENABLE_AI_TEXT_GENERATION: true,
                ENABLE_AI_IMAGE_SUGGESTIONS: true,
                ENABLE_AI_GENERATION: true,
                ANTHROPIC_MODEL: 'claude-3-5-sonnet-20241022',
                ANTHROPIC_TEMPERATURE: 0.7,
                OPENAI_MODEL: 'gpt-4o',
                OPENAI_TEMPERATURE: 0.7,
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  describe('generateText', () => {
    it('should generate text using Claude when provider is CLAUDE', async () => {
      // Arrange
      const dto = {
        provider: AIProvider.CLAUDE,
        contentType: ContentType.HERO_TITLE,
        context: 'عيادة أسنان حديثة',
        maxLength: 100,
        tone: 'احترافي',
      };

      mockAnthropicInstance.messages.create.mockResolvedValue({
        content: [{ type: 'text', text: 'ابتسامتك هي أولويتنا' }],
      } as any);

      // Act
      const result = await service.generateText(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.content).toBe('ابتسامتك هي أولويتنا');
      expect(result.provider).toBe(AIProvider.CLAUDE);
      expect(mockAnthropicInstance.messages.create).toHaveBeenCalled();
    });

    it('should generate text using OpenAI when provider is OPENAI', async () => {
      // Arrange
      const dto = {
        provider: AIProvider.OPENAI,
        contentType: ContentType.HERO_SUBTITLE,
        context: 'مطعم فاخر',
        maxLength: 150,
      };

      mockOpenAIInstance.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'نقدم أشهى الأطباق في أجواء راقية',
            },
          },
        ],
      } as any);

      // Act
      const result = await service.generateText(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.content).toBe('نقدم أشهى الأطباق في أجواء راقية');
      expect(result.provider).toBe(AIProvider.OPENAI);
      expect(mockOpenAIInstance.chat.completions.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if AI generation is disabled', async () => {
      // Arrange
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'ENABLE_AI_TEXT_GENERATION') return false;
        return 'test-value';
      });

      const dto = {
        provider: AIProvider.CLAUDE,
        contentType: ContentType.HERO_TITLE,
        context: 'test',
        maxLength: 100,
      };

      // Act & Assert
      await expect(service.generateText(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if provider is not available', async () => {
      // Arrange
      const dto = {
        provider: AIProvider.CLAUDE,
        contentType: ContentType.HERO_TITLE,
        context: 'test',
        maxLength: 100,
      };

      // Mock to simulate no API keys configured
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'ANTHROPIC_API_KEY' || key === 'OPENAI_API_KEY') return null;
        if (key === 'ENABLE_AI_TEXT_GENERATION') return true;
        return 'test-value';
      });

      // Recreate service with new config
      const module = await Test.createTestingModule({
        providers: [
          AiService,
          {
            provide: ConfigService,
            useValue: configService,
          },
        ],
      }).compile();

      const newService = module.get<AiService>(AiService);

      // Act & Assert
      await expect(newService.generateText(dto)).rejects.toThrow(BadRequestException);
    });

    it('should handle current content for improvement', async () => {
      // Arrange
      const dto = {
        provider: AIProvider.CLAUDE,
        contentType: ContentType.ABOUT_SECTION,
        context: 'عيادة أسنان',
        currentContent: 'نحن عيادة أسنان',
        maxLength: 200,
      };

      mockAnthropicInstance.messages.create.mockResolvedValue({
        content: [{ type: 'text', text: 'نحن عيادة أسنان متخصصة مع خبرة 20 عاماً' }],
      } as any);

      // Act
      const result = await service.generateText(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.content).toContain('عيادة أسنان');
    });
  });

  describe('searchImages', () => {
    it('should search images from Unsplash successfully', async () => {
      // Arrange
      const dto = {
        query: 'dental clinic',
        perPage: 12,
        page: 1,
      };

      const mockUnsplashResponse = {
        data: {
          total: 100,
          total_pages: 10,
          results: [
            {
              id: 'img-1',
              urls: {
                raw: 'https://example.com/raw',
                full: 'https://example.com/full',
                regular: 'https://example.com/regular',
                small: 'https://example.com/small',
                thumb: 'https://example.com/thumb',
              },
              alt_description: 'Dental clinic',
              description: 'Modern dental clinic',
              width: 1200,
              height: 800,
              color: '#ffffff',
              user: {
                name: 'John Doe',
                username: 'johndoe',
                portfolio_url: 'https://example.com/portfolio',
              },
              links: {
                download: 'https://example.com/download',
                download_location: 'https://example.com/download-location',
              },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockUnsplashResponse);

      // Act
      const result = await service.searchImages(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.total).toBe(100);
      expect(result.totalPages).toBe(10);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].id).toBe('img-1');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.unsplash.com/search/photos',
        expect.objectContaining({
          headers: {
            Authorization: 'Client-ID test-unsplash-key',
          },
          params: expect.objectContaining({
            query: 'dental clinic',
          }),
        }),
      );
    });

    it('should throw BadRequestException if image suggestions are disabled', async () => {
      // Arrange
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'ENABLE_AI_IMAGE_SUGGESTIONS') return false;
        return 'test-value';
      });

      const dto = {
        query: 'test',
        perPage: 12,
        page: 1,
      };

      // Act & Assert
      await expect(service.searchImages(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if Unsplash API key is missing', async () => {
      // Arrange
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'UNSPLASH_ACCESS_KEY') return null;
        if (key === 'ENABLE_AI_IMAGE_SUGGESTIONS') return true;
        return 'test-value';
      });

      // Recreate service
      const module = await Test.createTestingModule({
        providers: [
          AiService,
          {
            provide: ConfigService,
            useValue: configService,
          },
        ],
      }).compile();

      const newService = module.get<AiService>(AiService);

      const dto = {
        query: 'test',
        perPage: 12,
        page: 1,
      };

      // Act & Assert
      await expect(newService.searchImages(dto)).rejects.toThrow(BadRequestException);
    });

    it('should handle image search with filters', async () => {
      // Arrange
      const dto = {
        query: 'restaurant food',
        perPage: 20,
        page: 2,
        orientation: 'landscape' as any,
        color: 'blue',
      };

      mockedAxios.get.mockResolvedValue({
        data: {
          total: 50,
          total_pages: 3,
          results: [],
        },
      });

      // Act
      const result = await service.searchImages(dto);

      // Assert
      expect(result).toBeDefined();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.unsplash.com/search/photos',
        expect.objectContaining({
          params: expect.objectContaining({
            orientation: 'landscape',
            color: 'blue',
            page: 2,
            per_page: 20,
          }),
        }),
      );
    });
  });

  describe('suggestImagesForSection', () => {
    it('should suggest images based on industry and section type', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValue({
        data: {
          total: 30,
          total_pages: 3,
          results: [],
        },
      });

      // Act
      const result = await service.suggestImagesForSection('DENTAL', 'hero', 'modern clinic');

      // Assert
      expect(result).toBeDefined();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.unsplash.com/search/photos',
        expect.objectContaining({
          params: expect.objectContaining({
            orientation: 'landscape', // hero sections use landscape
            per_page: 12,
          }),
        }),
      );
    });

    it('should use correct orientation for different section types', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValue({
        data: { total: 10, total_pages: 1, results: [] },
      });

      // Act - test team section (should be squarish)
      await service.suggestImagesForSection('BUSINESS', 'team');

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            orientation: 'squarish',
          }),
        }),
      );
    });
  });

  describe('triggerImageDownload', () => {
    it('should trigger download for Unsplash image', async () => {
      // Arrange
      const downloadLocation = 'https://api.unsplash.com/photos/abc123/download';
      mockedAxios.get.mockResolvedValue({ data: { success: true } });

      // Act
      await service.triggerImageDownload(downloadLocation);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        downloadLocation,
        expect.objectContaining({
          headers: {
            Authorization: 'Client-ID test-unsplash-key',
          },
        }),
      );
    });

    it('should not throw error if download trigger fails', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      // Act & Assert - should not throw
      await expect(
        service.triggerImageDownload('https://example.com'),
      ).resolves.not.toThrow();
    });
  });

  describe('generateInitialSite', () => {
    it('should generate initial site with Claude', async () => {
      // Arrange
      const dto = {
        industry: 'DENTAL',
        businessName: 'عيادة الابتسامة',
        description: 'عيادة أسنان حديثة',
        colorPalette: {
          primary: '#00A6A6',
          secondary: '#EFDC05',
          accent: '#FF6B6B',
        },
        language: 'ar',
        contactInfo: {
          phone: '+966501234567',
          email: 'info@smile.com',
          address: 'الرياض، السعودية',
        },
      };

      const mockGeneratedContent = JSON.stringify({
        html: '<!DOCTYPE html><html dir="rtl"><head></head><body></body></html>',
        css: ':root { --primary: #00A6A6; }',
        js: 'console.log("loaded");',
      });

      mockAnthropicInstance.messages.create.mockResolvedValue({
        content: [{ type: 'text', text: mockGeneratedContent }],
      } as any);

      // Act
      const result = await service.generateInitialSite(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.html).toContain('<!DOCTYPE html>');
      expect(result.css).toContain('--primary');
      expect(result.sections).toBeDefined();
      expect(result.sections.length).toBeGreaterThan(0);
      expect(mockAnthropicInstance.messages.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if AI generation is disabled', async () => {
      // Arrange
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'ENABLE_AI_GENERATION') return false;
        return 'test-value';
      });

      const dto = {
        industry: 'DENTAL',
        businessName: 'Test',
        description: 'Test',
        colorPalette: { primary: '#000', secondary: '#fff', accent: '#ccc' },
      };

      // Act & Assert
      await expect(service.generateInitialSite(dto)).rejects.toThrow(BadRequestException);
    });

    it('should generate correct sections based on industry', async () => {
      // Arrange
      const dto = {
        industry: 'RESTAURANT',
        businessName: 'مطعم النخيل',
        description: 'مطعم عربي',
        colorPalette: { primary: '#000', secondary: '#fff', accent: '#ccc' },
      };

      mockAnthropicInstance.messages.create.mockResolvedValue({
        content: [
          {
            type: 'text',
            text: JSON.stringify({ html: '<html></html>', css: '', js: '' }),
          },
        ],
      } as any);

      // Act
      const result = await service.generateInitialSite(dto);

      // Assert
      expect(result.sections).toBeDefined();
      // Restaurant should have menu, gallery, testimonials
      const sectionTypes = result.sections.map((s) => s.type);
      expect(sectionTypes).toContain('products'); // menu
      expect(sectionTypes).toContain('gallery');
      expect(sectionTypes).toContain('testimonials');
    });

    it('should use RTL for Arabic language', async () => {
      // Arrange
      const dto = {
        industry: 'BUSINESS',
        businessName: 'شركة النجاح',
        description: 'شركة رائدة',
        colorPalette: { primary: '#000', secondary: '#fff', accent: '#ccc' },
        language: 'ar',
      };

      mockAnthropicInstance.messages.create.mockResolvedValue({
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              html: '<html dir="rtl"></html>',
              css: '',
              js: '',
            }),
          },
        ],
      } as any);

      // Act
      const result = await service.generateInitialSite(dto);

      // Assert
      expect(result.html).toContain('rtl');
    });

    it('should fallback to OpenAI if Claude is not available', async () => {
      // Arrange
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'ANTHROPIC_API_KEY') return null;
        if (key === 'OPENAI_API_KEY') return 'test-openai-key';
        if (key === 'ENABLE_AI_GENERATION') return true;
        return 'test-value';
      });

      // Recreate service
      const module = await Test.createTestingModule({
        providers: [
          AiService,
          {
            provide: ConfigService,
            useValue: configService,
          },
        ],
      }).compile();

      const newService = module.get<AiService>(AiService);

      const dto = {
        industry: 'STORE',
        businessName: 'متجر الإلكترونيات',
        description: 'متجر حديث',
        colorPalette: { primary: '#000', secondary: '#fff', accent: '#ccc' },
      };

      mockOpenAIInstance.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({ html: '<html></html>', css: '', js: '' }),
            },
          },
        ],
      } as any);

      // Act
      const result = await newService.generateInitialSite(dto);

      // Assert
      expect(result).toBeDefined();
      expect(mockOpenAIInstance.chat.completions.create).toHaveBeenCalled();
    });
  });
});
