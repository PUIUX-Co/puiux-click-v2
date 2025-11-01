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
  GenerateInitialSiteDto,
  GeneratedWebsite,
  GenerateSectionDto,
  GeneratedSection,
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to generate text:', errorMessage);
      
      // Provide more specific error messages
      if (errorMessage.includes('not_found_error') || errorMessage.includes('model:')) {
        throw new BadRequestException(
          'اسم الموديل غير صحيح. يرجى التحقق من ANTHROPIC_MODEL في ملف .env. الموديلات المتاحة: claude-sonnet-4-20250514 (موصى به), claude-opus-4-20250514, claude-3-5-sonnet-latest, claude-3-opus-20240229',
        );
      }
      
      if (errorMessage.includes('temperature') || errorMessage.includes('invalid_request')) {
        throw new BadRequestException(
          'خطأ في إعدادات API. يرجى التحقق من إعدادات ANTHROPIC_TEMPERATURE و OPENAI_TEMPERATURE في ملف .env (يجب أن تكون رقم بين 0 و 2)',
        );
      }
      
      if (errorMessage.includes('API key') || errorMessage.includes('unauthorized')) {
        throw new BadRequestException(
          'مفتاح API غير صحيح أو منتهي الصلاحية. يرجى التحقق من مفاتيح API في ملف .env',
        );
      }
      
      throw new BadRequestException(
        `فشل في توليد النص: ${errorMessage}. يرجى المحاولة مرة أخرى.`,
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

  /**
   * Generate a complete initial website based on wizard data
   * This creates a professional, fully-functional website that's ready to be edited
   */
  async generateInitialSite(dto: GenerateInitialSiteDto): Promise<GeneratedWebsite> {
    this.logger.log('='.repeat(60));
    this.logger.log('🚀 Starting AI site generation...');
    this.logger.log(`Business: ${dto.businessName}, Industry: ${dto.industry}`);

    // Check if AI generation is enabled
    const aiGenerationEnabled =
      this.config.get<string>('ENABLE_AI_GENERATION') === 'true' ||
      this.config.get<boolean>('ENABLE_AI_GENERATION') === true;

    this.logger.log(`AI Generation Enabled: ${aiGenerationEnabled}`);

    if (!aiGenerationEnabled) {
      this.logger.error('❌ AI generation is disabled in config');
      throw new BadRequestException('توليد المواقع بالذكاء الاصطناعي غير مفعل');
    }

    // Log which AI services are available
    const hasAnthropic = !!this.anthropic;
    const hasOpenAI = !!this.openai;
    const hasUnsplash = !!this.unsplashAccessKey;

    this.logger.log(`Available AI Services:`);
    this.logger.log(`  - Anthropic Claude: ${hasAnthropic ? '✅' : '❌'}`);
    this.logger.log(`  - OpenAI: ${hasOpenAI ? '✅' : '❌'}`);
    this.logger.log(`  - Unsplash: ${hasUnsplash ? '✅' : '❌'}`);

    if (!this.anthropic && !this.openai) {
      this.logger.error('❌ No AI service available (neither Claude nor OpenAI)');
      throw new BadRequestException(
        'خدمات الذكاء الاصطناعي غير متاحة. يرجى التحقق من ANTHROPIC_API_KEY أو OPENAI_API_KEY في ملف .env',
      );
    }

    try {
      const language = dto.language || 'ar';
      const isRTL = language === 'ar';

      // Get sections structure based on industry
      const sections = this.getSectionsForIndustry(dto.industry, dto.businessName);

      // 1. Fetch images from Unsplash for each section BEFORE generating with AI
      this.logger.log('Fetching images from Unsplash for sections...');
      const sectionImages: Record<string, string> = {};

      if (this.unsplashAccessKey) {
        try {
          for (const section of sections) {
            try {
              const imageResults = await this.suggestImagesForSection(
                dto.industry,
                section.type,
                dto.businessName,
              );

              if (imageResults.results && imageResults.results.length > 0) {
                // Use the first image URL (regular size for good quality/performance balance)
                const selectedImage = imageResults.results[0];
                sectionImages[section.id] = selectedImage.urls.regular;

                // Trigger download to comply with Unsplash API guidelines
                if (selectedImage.links.download_location) {
                  await this.triggerImageDownload(selectedImage.links.download_location);
                }

                this.logger.log(`Fetched Unsplash image for section: ${section.id}`);
              } else {
                // Fallback placeholder if no images found
                sectionImages[section.id] = `https://placehold.co/1200x600/${dto.colorPalette.primary.replace('#', '')}/ffffff?text=${encodeURIComponent(dto.businessName)}`;
              }
            } catch (sectionError) {
              this.logger.warn(`Failed to fetch image for section ${section.id}:`, sectionError);
              // Use placeholder if Unsplash fails for this section
              sectionImages[section.id] = `https://placehold.co/1200x600/${dto.colorPalette.primary.replace('#', '')}/ffffff?text=${encodeURIComponent(dto.businessName)}`;
            }
          }
        } catch (unsplashError) {
          this.logger.warn('Failed to fetch images from Unsplash, using placeholders:', unsplashError);
          // Use placeholders for all sections if Unsplash fails
          sections.forEach(section => {
            sectionImages[section.id] = `https://placehold.co/1200x600/${dto.colorPalette.primary.replace('#', '')}/ffffff?text=${encodeURIComponent(dto.businessName)}`;
          });
        }
      } else {
        this.logger.warn('Unsplash API key not configured, using placeholders');
        // Use placeholders if Unsplash not configured
        sections.forEach(section => {
          sectionImages[section.id] = `https://placehold.co/1200x600/${dto.colorPalette.primary.replace('#', '')}/ffffff?text=${encodeURIComponent(dto.businessName)}`;
        });
      }

      // 2. Build comprehensive prompt for site generation WITH Unsplash image URLs
      const prompt = this.buildSiteGenerationPrompt(dto, isRTL, sectionImages);

      this.logger.log('Generating site with AI using Claude/OpenAI and Unsplash images...');

      // 3. Generate with Claude (preferred for better quality) or OpenAI
      const content = this.anthropic
        ? await this.generateWithClaude(prompt, 8000)
        : await this.generateWithOpenAI(prompt, 8000);

      if (!content || content.trim().length === 0) {
        throw new Error('Empty response from AI service');
      }

      // Parse the JSON response - handle markdown code blocks
      let generated: any;
      try {
        // Try direct JSON parsing first
        generated = JSON.parse(content);
      } catch (parseError) {
        // If direct parsing fails, try to extract JSON from markdown code blocks
        this.logger.warn('Direct JSON parsing failed, trying to extract from markdown...');
        
        // Extract JSON from markdown code blocks (```json ... ```)
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          generated = JSON.parse(jsonMatch[1].trim());
        } else {
          // Try to extract JSON object from text
          const jsonObjectMatch = content.match(/\{[\s\S]*\}/);
          if (jsonObjectMatch && jsonObjectMatch[0]) {
            generated = JSON.parse(jsonObjectMatch[0]);
          } else {
            throw new Error(
              'Unable to parse AI response as JSON. Response format may be invalid.',
            );
          }
        }
      }

      // Validate parsed JSON structure
      if (!generated || typeof generated !== 'object') {
        throw new Error('Invalid JSON structure from AI response');
      }

      // 4. Ensure Unsplash image URLs are used in the generated HTML (replace any remaining placeholders)
      let finalHtml = generated.html || '';
      if (sectionImages && Object.keys(sectionImages).length > 0) {
        // Replace placeholders with actual Unsplash URLs if AI didn't use them
        // Use a more intelligent replacement strategy - replace each placeholder with its corresponding section image
        // IMPORTANT: Use replaceAll or regex with global flag to replace ALL occurrences, not just the first one
        const placeholderPattern = /https:\/\/placehold\.co\/[^"'\)\s]+/gi; // Global flag to replace all occurrences
        const imageUrls = Object.values(sectionImages);
        
        // Replace all placeholders with Unsplash URLs (cycle through available images)
        let placeholderIndex = 0;
        finalHtml = finalHtml.replace(placeholderPattern, () => {
          const imageUrl = imageUrls[placeholderIndex % imageUrls.length];
          placeholderIndex++;
          return imageUrl;
        });
      }

      this.logger.log('Successfully generated site with AI and Unsplash images');

      return {
        html: finalHtml || generated.html || '',
        css: generated.css || '',
        js: generated.js || '',
        sections,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error('Failed to generate initial site:', errorMessage);
      this.logger.debug('Error stack:', errorStack);

      // Provide more specific error messages
      if (errorMessage.includes('not_found_error') || errorMessage.includes('model:')) {
        throw new BadRequestException(
          'اسم الموديل غير صحيح. يرجى التحقق من ANTHROPIC_MODEL في ملف .env. الموديلات المتاحة: claude-sonnet-4-20250514 (موصى به), claude-opus-4-20250514, claude-3-5-sonnet-latest, claude-3-opus-20240229',
        );
      }
      
      if (errorMessage.includes('parse') || errorMessage.includes('JSON')) {
        throw new BadRequestException(
          'فشل في معالجة استجابة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.',
        );
      }

      if (errorMessage.includes('API key') || errorMessage.includes('unauthorized')) {
        throw new BadRequestException(
          'مفتاح API غير صحيح أو منتهي الصلاحية. يرجى التحقق من مفاتيح API في ملف .env',
        );
      }

      // Handle temperature/invalid_request errors
      if (errorMessage.includes('temperature') || errorMessage.includes('invalid_request')) {
        throw new BadRequestException(
          'خطأ في إعدادات API. يرجى التحقق من إعدادات ANTHROPIC_TEMPERATURE و OPENAI_TEMPERATURE في ملف .env (يجب أن تكون رقم بين 0 و 2)',
        );
      }

      throw new BadRequestException(
        `فشل في توليد الموقع: ${errorMessage}. يرجى المحاولة مرة أخرى.`,
      );
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

  private async generateWithClaude(prompt: string, maxTokens: number, modelOverride?: string): Promise<string> {
    // Parse temperature from config - handle all cases (undefined, string, number)
    const tempValue: string | number | undefined = this.config.get('ANTHROPIC_TEMPERATURE');
    
    let temperature: number;
    if (tempValue === undefined || tempValue === null || tempValue === '') {
      temperature = 0.7; // Default value
    } else if (typeof tempValue === 'number') {
      temperature = tempValue; // Already a number
    } else if (typeof tempValue === 'string') {
      const parsed = parseFloat(tempValue);
      temperature = isNaN(parsed) ? 0.7 : parsed; // Parse string to number
    } else {
      temperature = 0.7; // Fallback
    }
    
    // Ensure temperature is a valid number between 0 and 2
    const validTemperature = temperature < 0 || temperature > 2 ? 0.7 : temperature;

    this.logger.debug(`Using temperature: ${validTemperature} (from config: ${tempValue})`);

    // Define valid Claude model names
    const validModels = [
      // Claude 4 models (latest)
      'claude-sonnet-4-20250514',
      'claude-opus-4-20250514',
      'claude-sonnet-4-20250112',
      'claude-opus-4-20250112',
      // Claude 3.5 models
      'claude-3-5-sonnet-20241022',
      'claude-3-5-sonnet-latest',
      'claude-3-5-sonnet',
      // Claude 3 models (legacy)
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ];
    
    // Determine model to use: override > config > default
    const defaultModel = 'claude-sonnet-4-20250514';
    const configModel = this.config.get<string>('ANTHROPIC_MODEL') || defaultModel;
    const requestedModel = modelOverride || configModel;
    
    // Validate model name
    const finalModel = validModels.includes(requestedModel) ? requestedModel : defaultModel;
    
    if (finalModel !== requestedModel) {
      this.logger.warn(`Invalid model name: ${requestedModel}. Using default: ${finalModel}`);
    }
    
    this.logger.debug(`Using Claude model: ${finalModel}`);
    
    try {
      const response = await this.anthropic.messages.create({
        model: finalModel,
        max_tokens: Math.min(maxTokens * 2, 4096), // Approximate tokens from characters
        temperature: validTemperature,
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
    } catch (error: any) {
      // Handle Anthropic SDK errors with clear messages
      this.logger.error('Claude API error:', error);

      if (error.status === 401 || error.message?.includes('invalid_api_key') || error.message?.includes('authentication')) {
        throw new BadRequestException(
          'ANTHROPIC_API_KEY غير صالح أو منتهي الصلاحية. يرجى التحقق من API key في ملف .env',
        );
      }

      if (error.status === 429 || error.message?.includes('rate_limit')) {
        throw new BadRequestException(
          'تم تجاوز حد الاستخدام لـ Claude API. يرجى المحاولة لاحقاً أو ترقية خطتك.',
        );
      }

      if (error.status === 400) {
        throw new BadRequestException(
          `خطأ في طلب Claude API: ${error.message || 'طلب غير صالح'}`,
        );
      }

      // For network errors or other issues
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.message?.includes('network')) {
        throw new Error(
          `فشل الاتصال بـ Claude API: ${error.message}. يرجى التحقق من الاتصال بالإنترنت.`,
        );
      }

      // Re-throw with more context
      throw new Error(
        `Claude API error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  private async generateWithOpenAI(prompt: string, maxTokens: number): Promise<string> {
    // Parse temperature from config - handle all cases (undefined, string, number)
    const tempValue: string | number | undefined = this.config.get('OPENAI_TEMPERATURE');
    
    let temperature: number;
    if (tempValue === undefined || tempValue === null || tempValue === '') {
      temperature = 0.7; // Default value
    } else if (typeof tempValue === 'number') {
      temperature = tempValue; // Already a number
    } else if (typeof tempValue === 'string') {
      const parsed = parseFloat(tempValue);
      temperature = isNaN(parsed) ? 0.7 : parsed; // Parse string to number
    } else {
      temperature = 0.7; // Fallback
    }
    
    // Ensure temperature is a valid number between 0 and 2
    const validTemperature = temperature < 0 || temperature > 2 ? 0.7 : temperature;

    this.logger.debug(`Using temperature: ${validTemperature} (from config: ${tempValue})`);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.get<string>('OPENAI_MODEL') || 'gpt-4o',
        max_tokens: Math.min(maxTokens * 2, 4096),
        temperature: validTemperature,
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
    } catch (error: any) {
      // Handle OpenAI SDK errors with clear messages
      this.logger.error('OpenAI API error:', error);

      if (error.status === 401 || error.code === 'invalid_api_key' || error.message?.includes('Incorrect API key')) {
        throw new BadRequestException(
          'OPENAI_API_KEY غير صالح أو منتهي الصلاحية. يرجى التحقق من API key في ملف .env',
        );
      }

      if (error.status === 429 || error.code === 'rate_limit_exceeded') {
        throw new BadRequestException(
          'تم تجاوز حد الاستخدام لـ OpenAI API. يرجى المحاولة لاحقاً أو ترقية خطتك.',
        );
      }

      if (error.status === 400) {
        throw new BadRequestException(
          `خطأ في طلب OpenAI API: ${error.message || 'طلب غير صالح'}`,
        );
      }

      if (error.status === 403) {
        throw new BadRequestException(
          'الوصول لـ OpenAI API مرفوض. يرجى التحقق من صلاحيات API key.',
        );
      }

      // For network errors or other issues
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.message?.includes('network')) {
        throw new Error(
          `فشل الاتصال بـ OpenAI API: ${error.message}. يرجى التحقق من الاتصال بالإنترنت.`,
        );
      }

      // Re-throw with more context
      throw new Error(
        `OpenAI API error: ${error.message || 'Unknown error'}`,
      );
    }
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

  /**
   * Build comprehensive prompt for initial site generation
   */
  private buildSiteGenerationPrompt(
    dto: GenerateInitialSiteDto,
    isRTL: boolean,
    sectionImages?: Record<string, string>,
  ): string {
    const sections = this.getSectionsForIndustry(dto.industry, dto.businessName);
    const sectionsList = sections.map(s => `- ${s.title} (${s.type})`).join('\n');

    const contactInfo = dto.contactInfo || {};
    const contactDetails = `
الهاتف: ${contactInfo.phone || 'غير متوفر'}
البريد الإلكتروني: ${contactInfo.email || 'غير متوفر'}
العنوان: ${contactInfo.address || 'غير متوفر'}
واتساب: ${contactInfo.whatsapp || 'غير متوفر'}
فيسبوك: ${contactInfo.facebook || 'غير متوفر'}
إنستجرام: ${contactInfo.instagram || 'غير متوفر'}
`.trim();

    // Build images list for prompt
    let imagesSection = '';
    if (sectionImages && Object.keys(sectionImages).length > 0) {
      imagesSection = '\n\n**الصور من Unsplash (يجب استخدامها بدلاً من placeholders):**\n';
      sections.forEach(section => {
        if (sectionImages[section.id]) {
          imagesSection += `- ${section.title} (${section.id}): ${sectionImages[section.id]}\n`;
        }
      });
      imagesSection += '\n**مهم جداً:** استخدم الصور الفعلية من Unsplash المذكورة أعلاه بدلاً من placeholders.';
    } else {
      // Fallback to placeholder if no images
      const placeholderUrl = `https://placehold.co/1200x600/${dto.colorPalette.primary.replace('#', '')}/ffffff?text=${encodeURIComponent(dto.businessName)}`;
      imagesSection = `\n\n**للصور:** استخدم placeholder: ${placeholderUrl}`;
    }

    return `أنت خبير تصميم مواقع ويب محترف ومطور Front-End متخصص.

**المهمة:** أنشئ موقع ويب HTML/CSS/JS كامل ومتكامل وجاهز للاستخدام.

**معلومات الموقع:**
- نوع النشاط: ${this.getIndustryArabicName(dto.industry)}
- اسم النشاط: ${dto.businessName}
- الوصف: ${dto.description}
- اللغة: ${isRTL ? 'العربية (RTL)' : 'الإنجليزية (LTR)'}

**نظام الألوان:**
- اللون الأساسي (Primary): ${dto.colorPalette.primary}
- اللون الثانوي (Secondary): ${dto.colorPalette.secondary}
- اللون المميز (Accent): ${dto.colorPalette.accent}

**معلومات التواصل:**
${contactDetails}

**الأقسام المطلوبة:**
${sectionsList}

**المتطلبات الفنية:**

1. **HTML:**
   - استخدم بنية HTML5 دلالية (semantic)
   - ${isRTL ? 'أضف dir="rtl" lang="ar" إلى <html>' : 'أضف dir="ltr" lang="en" إلى <html>'}
   - استخدم Tailwind CSS classes للتصميم
   - أضف data-gjs-type للعناصر الرئيسية لدعم GrapesJS
   - كل section يجب أن يكون له id فريد

2. **التصميم (CSS):**
   - استخدم نظام الألوان المحدد فقط
   - التصميم يجب أن يكون Modern و Professional
   - Responsive Design (Mobile-First)
   - استخدم Flexbox و Grid
   - Smooth transitions و animations
   - Glass morphism effects حيث مناسب
   - ${isRTL ? 'دعم كامل للـ RTL' : 'دعم LTR'}

3. **المحتوى:**
   - ${isRTL ? 'اكتب المحتوى بالعربية الفصحى' : 'Write content in English'}
   - محتوى واقعي وجذاب
   - استخدم معلومات النشاط المقدمة${imagesSection}

4. **JavaScript (اختياري):**
   - أضف تفاعلات بسيطة إذا لزم الأمر
   - Mobile menu toggle
   - Smooth scroll
   - Animations on scroll

**هيكل الأقسام المطلوب:**

- **Header/Navigation:** شريط تنقل ثابت مع logo و روابط الأقسام
- **Hero Section:** قسم رئيسي جذاب مع عنوان رئيسي و CTA
- **About Section:** نبذة عن النشاط مع صورة
- **Services/Products Section:** عرض الخدمات أو المنتجات في Grid
- **Contact Section:** نموذج تواصل + معلومات الاتصال
- **Footer:** روابط مهمة + معلومات التواصل + حقوق النشر

**التنسيق المطلوب:**

أرجع JSON فقط بدون أي نص إضافي بالشكل التالي:

\`\`\`json
{
  "html": "<!DOCTYPE html>\\n<html dir=\\"${isRTL ? 'rtl' : 'ltr'}\\" lang=\\"${isRTL ? 'ar' : 'en'}\\">\\n<head>...</head>\\n<body>...</body>\\n</html>",
  "css": "/* Custom CSS here */\\n:root {\\n  --primary: ${dto.colorPalette.primary};\\n  --secondary: ${dto.colorPalette.secondary};\\n  --accent: ${dto.colorPalette.accent};\\n}\\n...",
  "js": "// Optional JavaScript\\nconsole.log('Site loaded');"
}
\`\`\`

**ملاحظات مهمة:**
- الموقع يجب أن يكون كامل و Professional و جاهز للاستخدام فوراً
- التصميم يجب أن يكون مناسب لنوع النشاط
- استخدم أفضل الممارسات في UI/UX
- الموقع يجب أن يكون متوافق مع GrapesJS Editor
- NO markdown code blocks في الإخراج - JSON فقط!

ابدأ الآن:`;
  }

  /**
   * Get sections structure based on industry
   */
  private getSectionsForIndustry(industry: string, _businessName: string): Array<{
    id: string;
    type: string;
    title: string;
    order: number;
  }> {
    const baseSections = [
      { id: 'hero', type: 'hero', title: 'القسم الرئيسي', order: 1 },
      { id: 'about', type: 'about', title: 'من نحن', order: 2 },
    ];

    const industrySections: Record<string, any[]> = {
      RESTAURANT: [
        { id: 'menu', type: 'products', title: 'قائمة الطعام', order: 3 },
        { id: 'gallery', type: 'gallery', title: 'معرض الصور', order: 4 },
        { id: 'testimonials', type: 'testimonials', title: 'آراء العملاء', order: 5 },
        { id: 'contact', type: 'contact', title: 'تواصل معنا', order: 6 },
      ],
      DENTAL: [
        { id: 'services', type: 'services', title: 'الخدمات', order: 3 },
        { id: 'team', type: 'team', title: 'فريق العمل', order: 4 },
        { id: 'testimonials', type: 'testimonials', title: 'آراء المرضى', order: 5 },
        { id: 'contact', type: 'contact', title: 'احجز موعد', order: 6 },
      ],
      PORTFOLIO: [
        { id: 'services', type: 'services', title: 'الخدمات', order: 3 },
        { id: 'portfolio', type: 'gallery', title: 'أعمالنا', order: 4 },
        { id: 'testimonials', type: 'testimonials', title: 'آراء العملاء', order: 5 },
        { id: 'contact', type: 'contact', title: 'تواصل معنا', order: 6 },
      ],
      BUSINESS: [
        { id: 'services', type: 'services', title: 'خدماتنا', order: 3 },
        { id: 'features', type: 'features', title: 'مميزاتنا', order: 4 },
        { id: 'team', type: 'team', title: 'فريق العمل', order: 5 },
        { id: 'contact', type: 'contact', title: 'تواصل معنا', order: 6 },
      ],
      STORE: [
        { id: 'products', type: 'products', title: 'المنتجات', order: 3 },
        { id: 'categories', type: 'categories', title: 'التصنيفات', order: 4 },
        { id: 'testimonials', type: 'testimonials', title: 'آراء العملاء', order: 5 },
        { id: 'contact', type: 'contact', title: 'تواصل معنا', order: 6 },
      ],
    };

    const sections = industrySections[industry] || industrySections.BUSINESS;
    return [...baseSections, ...sections];
  }

  /**
   * Get Arabic name for industry
   */
  private getIndustryArabicName(industry: string): string {
    const names: Record<string, string> = {
      RESTAURANT: 'مطعم',
      DENTAL: 'عيادة أسنان',
      PORTFOLIO: 'معرض أعمال',
      BUSINESS: 'شركة',
      STORE: 'متجر إلكتروني',
    };
    return names[industry] || 'نشاط تجاري';
  }

  /**
   * Generate a complete section (HTML/CSS) that can be added to an existing site
   * This creates a professional section compatible with GrapesJS editor
   */
  async generateSection(dto: GenerateSectionDto): Promise<GeneratedSection> {
    // Check if AI generation is enabled
    const aiGenerationEnabled = 
      this.config.get<string>('ENABLE_AI_GENERATION') === 'true' ||
      this.config.get<boolean>('ENABLE_AI_GENERATION') === true;
    
    if (!aiGenerationEnabled) {
      throw new BadRequestException('توليد الأقسام بالذكاء الاصطناعي غير مفعل');
    }

    if (!this.anthropic && !this.openai) {
      throw new BadRequestException(
        'خدمات الذكاء الاصطناعي غير متاحة. يرجى التحقق من ANTHROPIC_API_KEY أو OPENAI_API_KEY في ملف .env',
      );
    }

    try {
      const language = dto.language || 'ar';
      const isRTL = language === 'ar';

      // Get section image from Unsplash if available
      let sectionImage: string | undefined;
      if (this.unsplashAccessKey && dto.industry) {
        try {
          const imageResults = await this.suggestImagesForSection(
            dto.industry,
            dto.sectionType,
            dto.context,
          );
          if (imageResults.results && imageResults.results.length > 0) {
            const selectedImage = imageResults.results[0];
            sectionImage = selectedImage.urls.regular;
            // Trigger download to comply with Unsplash API guidelines
            if (selectedImage.links.download_location) {
              await this.triggerImageDownload(selectedImage.links.download_location);
            }
          }
        } catch (imageError) {
          this.logger.warn('Failed to fetch section image from Unsplash:', imageError);
        }
      }

      // Build section generation prompt
      const prompt = this.buildSectionPrompt(dto, isRTL, sectionImage);

      // Generate with Claude (preferred) or OpenAI
      const content = this.anthropic
        ? await this.generateWithClaude(prompt, 4000)
        : await this.generateWithOpenAI(prompt, 4000);

      if (!content || content.trim().length === 0) {
        throw new Error('Empty response from AI service');
      }

      // Parse the JSON response
      let generated: any;
      try {
        generated = JSON.parse(content);
      } catch (parseError) {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          generated = JSON.parse(jsonMatch[1].trim());
        } else {
          const jsonObjectMatch = content.match(/\{[\s\S]*\}/);
          if (jsonObjectMatch && jsonObjectMatch[0]) {
            generated = JSON.parse(jsonObjectMatch[0]);
          } else {
            throw new Error('Unable to parse AI response as JSON');
          }
        }
      }

      // Validate parsed JSON structure
      if (!generated || typeof generated !== 'object') {
        throw new Error('Invalid JSON structure from AI response');
      }

      // Generate unique section ID
      const sectionId = `section-${dto.sectionType}-${Date.now()}`;

      // Ensure image URL is used if provided
      let finalHtml = generated.html || '';
      if (sectionImage) {
        const placeholderPattern = /https:\/\/placehold\.co\/[^"'\)\s]+/gi;
        finalHtml = finalHtml.replace(placeholderPattern, sectionImage);
      }

      this.logger.log(`Successfully generated ${dto.sectionType} section`);

      return {
        html: finalHtml || '',
        css: generated.css || '',
        js: generated.js || '',
        sectionId,
        sectionType: dto.sectionType,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to generate section:', errorMessage);

      if (errorMessage.includes('not_found_error') || errorMessage.includes('model:')) {
        throw new BadRequestException(
          'اسم الموديل غير صحيح. يرجى التحقق من ANTHROPIC_MODEL في ملف .env',
        );
      }

      if (errorMessage.includes('parse') || errorMessage.includes('JSON')) {
        throw new BadRequestException(
          'فشل في معالجة استجابة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.',
        );
      }

      throw new BadRequestException(
        `فشل في توليد القسم: ${errorMessage}. يرجى المحاولة مرة أخرى.`,
      );
    }
  }

  /**
   * Build prompt for section generation
   */
  private buildSectionPrompt(
    dto: GenerateSectionDto,
    isRTL: boolean,
    sectionImage?: string,
  ): string {
    const sectionNames: Record<string, string> = {
      about: 'قسم "من نحن"',
      services: 'قسم "خدماتنا"',
      products: 'قسم "منتجاتنا"',
      team: 'قسم "فريق العمل"',
      testimonials: 'قسم "آراء العملاء"',
      gallery: 'قسم "معرض الصور"',
      contact: 'قسم "تواصل معنا"',
      features: 'قسم "مميزاتنا"',
      hero: 'قسم "الرئيسي"',
    };

    const sectionName = sectionNames[dto.sectionType] || 'قسم';

    const colorPalette = dto.colorPalette || {};
    const colorInfo = `
نظام الألوان:
- اللون الأساسي: ${colorPalette.primary || '#3B82F6'}
- اللون الثانوي: ${colorPalette.secondary || '#10B981'}
- اللون المميز: ${colorPalette.accent || '#F59E0B'}
`.trim();

    let imageInfo = '';
    if (sectionImage) {
      imageInfo = `\n\n**صورة القسم:** استخدم هذه الصورة: ${sectionImage}`;
    } else {
      const placeholderColor = (colorPalette.primary || '#3B82F6').replace('#', '');
      imageInfo = `\n\n**للصور:** استخدم placeholder: https://placehold.co/1200x600/${placeholderColor}/ffffff?text=${encodeURIComponent(dto.businessName || 'Section')}`;
    }

    return `أنت خبير تصميم مواقع ويب محترف.

**المهمة:** أنشئ ${sectionName} كامل وجاهز للاستخدام مع HTML/CSS.

**معلومات النشاط:**
- اسم النشاط: ${dto.businessName || 'غير محدد'}
- نوع النشاط: ${dto.industry || 'نشاط تجاري'}
- الوصف: ${dto.description || dto.context}
- اللغة: ${isRTL ? 'العربية (RTL)' : 'الإنجليزية (LTR)'}

${colorInfo}
${imageInfo}

**المتطلبات:**

1. **HTML:**
   - استخدم HTML5 دلالي (semantic)
   - ${isRTL ? 'أضف dir="rtl" إلى العنصر الرئيسي' : 'أضف dir="ltr" إلى العنصر الرئيسي'}
   - استخدم Tailwind CSS classes
   - أضف data-gjs-type="section" للعنصر الرئيسي
   - أضف id فريد للقسم
   - استخدم classes مناسبة مثل: container, mx-auto, px-4, py-16, etc.

2. **CSS:**
   - استخدم نظام الألوان المحدد
   - تصميم Modern و Professional
   - Responsive (Mobile-First)
   - استخدام Flexbox/Grid حسب الحاجة
   - Smooth transitions و animations حيث مناسب
   - ${isRTL ? 'دعم RTL كامل' : 'دعم LTR'}

3. **المحتوى:**
   - ${isRTL ? 'اكتب المحتوى بالعربية الفصحى' : 'Write content in English'}
   - محتوى واقعي وجذاب بناءً على السياق المقدم
   - استخدم المعلومات المتاحة عن النشاط

**التنسيق المطلوب:**

أرجع JSON فقط بدون أي نص إضافي:

\`\`\`json
{
  "html": "<section id=\\"...\\" data-gjs-type=\\"section\\" class=\\"py-16 bg-...\\" dir=\\"${isRTL ? 'rtl' : 'ltr'}\\">...</section>",
  "css": "/* Custom CSS if needed */\\n.section-custom { ... }",
  "js": "// Optional JavaScript"
}
\`\`\`

**ملاحظات:**
- القسم يجب أن يكون كامل و Professional و جاهز للاستخدام
- التصميم يجب أن يكون مناسب لنوع القسم والنشاط
- استخدم أفضل الممارسات في UI/UX
- NO markdown code blocks في الإخراج - JSON فقط!`;
  }
}
