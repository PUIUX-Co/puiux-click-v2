import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import axios from 'axios';
import {
  GenerateTextDto,
  AIProvider,
  ContentType,
  SearchImagesDto,
  SearchImagesResponseDto,
  UnsplashImage,
} from './dto';

/**
 * AI Service
 * Handles AI text generation (Claude/OpenAI) and image search (Unsplash)
 */
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private anthropic: Anthropic;
  private openai: OpenAI;
  private unsplashAccessKey: string;

  constructor(private config: ConfigService) {
    // Initialize Anthropic Claude
    const anthropicKey = this.config.get<string>('ANTHROPIC_API_KEY');
    if (anthropicKey) {
      this.anthropic = new Anthropic({ apiKey: anthropicKey });
    }

    // Initialize OpenAI
    const openaiKey = this.config.get<string>('OPENAI_API_KEY');
    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    }

    // Initialize Unsplash
    this.unsplashAccessKey = this.config.get<string>('UNSPLASH_ACCESS_KEY');
  }

  /**
   * Generate text content using AI
   */
  async generateText(dto: GenerateTextDto): Promise<{ content: string; provider: string }> {
    // Check if AI generation is enabled
    if (!this.config.get<boolean>('ENABLE_AI_TEXT_GENERATION')) {
      throw new BadRequestException('توليد النصوص بالذكاء الاصطناعي غير مفعل');
    }

    try {
      const prompt = this.buildPrompt(dto);

      let content: string;

      if (dto.provider === AIProvider.CLAUDE && this.anthropic) {
        content = await this.generateWithClaude(prompt, dto.maxLength);
      } else if (dto.provider === AIProvider.OPENAI && this.openai) {
        content = await this.generateWithOpenAI(prompt, dto.maxLength);
      } else {
        throw new BadRequestException('مزود الذكاء الاصطناعي غير متاح');
      }

      return {
        content,
        provider: dto.provider,
      };
    } catch (error) {
      this.logger.error('Failed to generate text:', error);
      throw new BadRequestException(
        'فشل في توليد النص. يرجى المحاولة مرة أخرى.',
      );
    }
  }

  /**
   * Search images from Unsplash
   */
  async searchImages(dto: SearchImagesDto): Promise<SearchImagesResponseDto> {
    if (!this.config.get<boolean>('ENABLE_AI_IMAGE_SUGGESTIONS')) {
      throw new BadRequestException('اقتراحات الصور غير مفعلة');
    }

    if (!this.unsplashAccessKey) {
      throw new BadRequestException('Unsplash API غير مكون');
    }

    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        headers: {
          Authorization: `Client-ID ${this.unsplashAccessKey}`,
        },
        params: {
          query: dto.query,
          per_page: dto.perPage,
          page: dto.page,
          orientation: dto.orientation,
          color: dto.color,
        },
      });

      return {
        total: response.data.total,
        totalPages: response.data.total_pages,
        results: response.data.results.map((img: any) => this.formatUnsplashImage(img)),
      };
    } catch (error) {
      this.logger.error('Failed to search images:', error);
      throw new BadRequestException('فشل البحث عن الصور. يرجى المحاولة مرة أخرى.');
    }
  }

  /**
   * Get image suggestions for a section based on industry and content
   */
  async suggestImagesForSection(
    industry: string,
    sectionType: string,
    context?: string,
  ): Promise<SearchImagesResponseDto> {
    // Build smart query based on industry and section
    const query = this.buildImageQuery(industry, sectionType, context);

    return this.searchImages({
      query,
      perPage: 12,
      page: 1,
      orientation: this.getOrientationForSection(sectionType),
    });
  }

  /**
   * Trigger download for Unsplash image (required by Unsplash API guidelines)
   */
  async triggerImageDownload(downloadLocation: string): Promise<void> {
    try {
      await axios.get(downloadLocation, {
        headers: {
          Authorization: `Client-ID ${this.unsplashAccessKey}`,
        },
      });
    } catch (error) {
      this.logger.warn('Failed to trigger download:', error);
    }
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private buildPrompt(dto: GenerateTextDto): string {
    const contentTypePrompts: Record<ContentType, string> = {
      [ContentType.HERO_TITLE]: 'عنوان رئيسي جذاب وقوي',
      [ContentType.HERO_SUBTITLE]: 'نص فرعي مختصر وواضح',
      [ContentType.ABOUT_SECTION]: 'نص تعريفي شامل',
      [ContentType.SERVICE_DESCRIPTION]: 'وصف خدمة احترافي',
      [ContentType.PRODUCT_DESCRIPTION]: 'وصف منتج تسويقي',
      [ContentType.CTA_TEXT]: 'نص دعوة لاتخاذ إجراء',
      [ContentType.TESTIMONIAL]: 'شهادة عميل',
      [ContentType.BLOG_POST]: 'مقالة مدونة',
      [ContentType.CUSTOM]: 'محتوى مخصص',
    };

    const contentTypeDesc = contentTypePrompts[dto.contentType] || 'محتوى';

    let prompt = `أنت كاتب محتوى محترف. اكتب ${contentTypeDesc} باللغة العربية بأسلوب ${dto.tone || 'احترافي'}.\n\n`;
    prompt += `السياق: ${dto.context}\n\n`;

    if (dto.currentContent) {
      prompt += `المحتوى الحالي: ${dto.currentContent}\n\n`;
      prompt += 'قم بتحسين وتطوير المحتوى الحالي.\n\n';
    }

    prompt += `الطول المطلوب: حوالي ${dto.maxLength} حرف.\n\n`;
    prompt += 'المتطلبات:\n';
    prompt += '- اكتب باللغة العربية الفصحى\n';
    prompt += '- استخدم أسلوب جذاب ومقنع\n';
    prompt += '- كن واضحاً ومباشراً\n';
    prompt += '- تجنب التكرار\n';
    prompt += '- أضف قيمة حقيقية\n\n';
    prompt += 'النص فقط بدون أي إضافات أو تعليقات:';

    return prompt;
  }

  private async generateWithClaude(prompt: string, maxTokens: number): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: this.config.get<string>('ANTHROPIC_MODEL') || 'claude-3-5-sonnet-20241022',
      max_tokens: Math.min(maxTokens * 2, 4096), // Approximate tokens from characters
      temperature: this.config.get<number>('ANTHROPIC_TEMPERATURE') || 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text.trim();
    }

    throw new Error('Unexpected response format from Claude');
  }

  private async generateWithOpenAI(prompt: string, maxTokens: number): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: this.config.get<string>('OPENAI_MODEL') || 'gpt-4o',
      max_tokens: Math.min(maxTokens * 2, 4096),
      temperature: this.config.get<number>('OPENAI_TEMPERATURE') || 0.7,
      messages: [
        {
          role: 'system',
          content: 'أنت كاتب محتوى محترف متخصص في كتابة المحتوى العربي الإبداعي.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.choices[0]?.message?.content?.trim() || '';
  }

  private buildImageQuery(
    industry: string,
    sectionType: string,
    context?: string,
  ): string {
    const industryKeywords: Record<string, string> = {
      RESTAURANT: 'food restaurant dining',
      DENTAL: 'dental dentist clinic teeth',
      PORTFOLIO: 'creative professional portfolio',
      BUSINESS: 'business professional office',
      STORE: 'shopping products ecommerce',
    };

    const sectionKeywords: Record<string, string> = {
      hero: 'hero banner modern',
      about: 'team office people',
      services: 'service professional',
      products: 'product showcase',
      contact: 'contact communication',
      testimonials: 'happy customer',
      team: 'team professional',
      gallery: 'gallery showcase',
    };

    const industryKeyword = industryKeywords[industry] || 'business';
    const sectionKeyword = sectionKeywords[sectionType] || 'modern';

    let query = `${industryKeyword} ${sectionKeyword}`;

    if (context) {
      query += ` ${context}`;
    }

    return query;
  }

  private getOrientationForSection(sectionType: string): 'landscape' | 'portrait' | 'squarish' {
    const landscapeSections = ['hero', 'about', 'contact'];
    const squarishSections = ['team', 'testimonials', 'products'];

    if (landscapeSections.includes(sectionType)) return 'landscape';
    if (squarishSections.includes(sectionType)) return 'squarish';

    return 'landscape';
  }

  private formatUnsplashImage(img: any): UnsplashImage {
    return {
      id: img.id,
      urls: {
        raw: img.urls.raw,
        full: img.urls.full,
        regular: img.urls.regular,
        small: img.urls.small,
        thumb: img.urls.thumb,
      },
      alt_description: img.alt_description || img.description || '',
      description: img.description || '',
      width: img.width,
      height: img.height,
      color: img.color,
      user: {
        name: img.user.name,
        username: img.user.username,
        portfolio_url: img.user.portfolio_url,
      },
      links: {
        download: img.links.download,
        download_location: img.links.download_location,
      },
    };
  }
}
