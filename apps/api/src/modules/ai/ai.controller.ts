import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateTextDto, SearchImagesDto, SearchImagesResponseDto, GenerateSectionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * AI Controller
 * Endpoints for AI text generation and image search
 */
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * POST /api/ai/generate-text
   * Generate text content using AI
   */
  @Post('generate-text')
  @HttpCode(HttpStatus.OK)
  async generateText(
    @Body() generateTextDto: GenerateTextDto,
  ): Promise<{
    success: boolean;
    data: { content: string; provider: string };
  }> {
    const result = await this.aiService.generateText(generateTextDto);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * GET /api/ai/search-images
   * Search images from Unsplash
   */
  @Get('search-images')
  async searchImages(
    @Query() searchImagesDto: SearchImagesDto,
  ): Promise<{
    success: boolean;
    data: SearchImagesResponseDto;
  }> {
    const result = await this.aiService.searchImages(searchImagesDto);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * GET /api/ai/suggest-images/:industry/:sectionType
   * Get smart image suggestions for a section
   */
  @Get('suggest-images/:industry/:sectionType')
  async suggestImages(
    @Param('industry') industry: string,
    @Param('sectionType') sectionType: string,
    @Query('context') context?: string,
  ): Promise<{
    success: boolean;
    data: SearchImagesResponseDto;
  }> {
    const result = await this.aiService.suggestImagesForSection(
      industry,
      sectionType,
      context,
    );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * POST /api/ai/trigger-download
   * Trigger Unsplash image download (required by Unsplash API)
   */
  @Post('trigger-download')
  @HttpCode(HttpStatus.OK)
  async triggerDownload(
    @Body('downloadLocation') downloadLocation: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    await this.aiService.triggerImageDownload(downloadLocation);

    return {
      success: true,
      message: 'تم تسجيل التحميل بنجاح',
    };
  }

  /**
   * POST /api/ai/generate-section
   * Generate a complete section (HTML/CSS) that can be added to a page
   */
  @Post('generate-section')
  @HttpCode(HttpStatus.OK)
  async generateSection(
    @Body() generateSectionDto: GenerateSectionDto,
  ): Promise<{
    success: boolean;
    data: import('./dto/generate-section.dto').GeneratedSection;
  }> {
    const result = await this.aiService.generateSection(generateSectionDto);

    return {
      success: true,
      data: result,
    };
  }
}
