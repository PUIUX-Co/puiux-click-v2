/**
 * Voice AI Engine
 *
 * Advanced natural language processing for Arabic dialects
 * Understands mixed Arabic/English terms and extracts keywords
 */

import {
  industryKeywords,
  contactKeywords,
  colorKeywords,
  technicalTerms,
  type ExtractedKeywords,
  type VoiceDialect,
} from '@/types/voice';
import { industries, colorSchemes } from '@/types/chat';

export class VoiceAI {
  /**
   * Detect dialect from transcript
   */
  static detectDialect(transcript: string): VoiceDialect {
    const lowerText = transcript.toLowerCase();

    // السعودية النجدية
    const saudiMarkers = ['وش', 'كيفك', 'زين', 'الحين', 'عشان', 'ليش', 'وين'];
    const saudiScore = saudiMarkers.filter((m) => lowerText.includes(m)).length;

    // المصرية
    const egyptianMarkers = ['إزيك', 'ايه', 'دلوقتي', 'عايز', 'بقى', 'يعني', 'كده'];
    const egyptianScore = egyptianMarkers.filter((m) => lowerText.includes(m)).length;

    if (saudiScore > egyptianScore) {
      return 'saudi-najdi';
    } else if (egyptianScore > saudiScore) {
      return 'egyptian';
    }

    return 'standard';
  }

  /**
   * Extract industry from natural language
   */
  static extractIndustry(transcript: string): string | null {
    const lowerText = transcript.toLowerCase();

    // Check each industry
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return industry;
        }
      }
    }

    return null;
  }

  /**
   * Extract business name from transcript
   * Looks for patterns like:
   * - "اسمه..." / "اسمها..."
   * - "يسمى..." / "تسمى..."
   * - Direct mention after industry
   */
  static extractBusinessName(transcript: string, industry?: string): string | null {
    const patterns = [
      /(?:اسمه|اسمها|اسم|يسمى|تسمى)\s+([^\s،؛.]+(?:\s+[^\s،؛.]+){0,3})/,
      /(?:مطعم|محل|متجر|عيادة|شركة)\s+([^\s،؛.]+(?:\s+[^\s،؛.]+){0,2})/,
    ];

    for (const pattern of patterns) {
      const match = transcript.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // If no pattern match, extract first capitalized phrase
    const words = transcript.split(/\s+/);
    const capitalizedPhrases: string[] = [];
    let currentPhrase = '';

    for (const word of words) {
      // Check if word starts with capital letter or is all caps
      if (/^[A-ZÀ-ÿ\u0600-\u06FF]/.test(word)) {
        currentPhrase += (currentPhrase ? ' ' : '') + word;
      } else if (currentPhrase) {
        capitalizedPhrases.push(currentPhrase);
        currentPhrase = '';
      }
    }

    if (currentPhrase) {
      capitalizedPhrases.push(currentPhrase);
    }

    return capitalizedPhrases[0] || null;
  }

  /**
   * Extract contact information
   * Supports:
   * - Phone numbers (Saudi, Egyptian, international)
   * - Email addresses
   * - Addresses
   */
  static extractContact(transcript: string): ExtractedKeywords['contact'] {
    const contact: ExtractedKeywords['contact'] = {};

    // Phone number patterns
    const phonePatterns = [
      /(?:\+?966|0)?5\d{8}/g, // Saudi mobile
      /(?:\+?20|0)?1[0125]\d{8}/g, // Egyptian mobile
      /\+?\d{10,15}/g, // International
    ];

    for (const pattern of phonePatterns) {
      const matches = transcript.match(pattern);
      if (matches && matches.length > 0) {
        contact.phone = matches[0];
        break;
      }
    }

    // Email pattern
    const emailPattern = /[\w.-]+@[\w.-]+\.\w+/g;
    const emailMatches = transcript.match(emailPattern);
    if (emailMatches && emailMatches.length > 0) {
      contact.email = emailMatches[0];
    }

    // If no structured data, check for keywords and extract context
    if (!contact.phone) {
      const phoneKeywordIndex = contactKeywords.phone.findIndex((kw) =>
        transcript.toLowerCase().includes(kw.toLowerCase())
      );
      if (phoneKeywordIndex !== -1) {
        // Extract numbers after keyword
        const afterKeyword = transcript.substring(phoneKeywordIndex);
        const numbers = afterKeyword.match(/\d[\d\s-]{7,}/);
        if (numbers) {
          contact.phone = numbers[0].replace(/\s|-/g, '');
        }
      }
    }

    if (!contact.email) {
      const emailKeywordIndex = contactKeywords.email.findIndex((kw) =>
        transcript.toLowerCase().includes(kw.toLowerCase())
      );
      if (emailKeywordIndex !== -1) {
        const afterKeyword = transcript.substring(emailKeywordIndex);
        const email = afterKeyword.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (email) {
          contact.email = email[0];
        }
      }
    }

    // Address (capture full context)
    const addressKeywordIndex = contactKeywords.address.findIndex((kw) =>
      transcript.toLowerCase().includes(kw.toLowerCase())
    );
    if (addressKeywordIndex !== -1) {
      contact.address = transcript;
    }

    return contact;
  }

  /**
   * Extract colors from natural language
   * Supports Arabic and English color names
   */
  static extractColors(transcript: string): string[] {
    const lowerText = transcript.toLowerCase();
    const foundColors: string[] = [];

    for (const [color, keywords] of Object.entries(colorKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          foundColors.push(color);
          break;
        }
      }
    }

    return foundColors;
  }

  /**
   * Extract technical terms (mixed Arabic/English)
   */
  static extractTechnicalTerms(transcript: string): string[] {
    const lowerText = transcript.toLowerCase();
    const foundTerms: string[] = [];

    for (const [term, keywords] of Object.entries(technicalTerms)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          foundTerms.push(term);
          break;
        }
      }
    }

    return foundTerms;
  }

  /**
   * Extract all keywords from transcript
   * This is the main extraction function
   */
  static extractKeywords(transcript: string): ExtractedKeywords {
    const keywords: ExtractedKeywords = {
      mixed: [],
    };

    // Industry
    const industry = this.extractIndustry(transcript);
    if (industry) {
      keywords.industry = [industry];
    }

    // Business name
    const businessName = this.extractBusinessName(transcript, industry || undefined);
    if (businessName) {
      keywords.businessName = businessName;
    }

    // Contact
    keywords.contact = this.extractContact(transcript);

    // Colors
    const colors = this.extractColors(transcript);
    if (colors.length > 0) {
      keywords.colors = colors;
    }

    // Technical terms
    const technicalTermsList = this.extractTechnicalTerms(transcript);
    if (technicalTermsList.length > 0) {
      keywords.mixed = technicalTermsList;
    }

    return keywords;
  }

  /**
   * Clean and normalize transcript
   * Fixes common speech recognition errors
   */
  static normalizeTranscript(transcript: string): string {
    let normalized = transcript;

    // Remove extra whitespace
    normalized = normalized.replace(/\s+/g, ' ').trim();

    // Fix common Arabic speech recognition errors
    const corrections: Record<string, string> = {
      'ايه ميل': 'إيميل',
      'واتس اب': 'واتساب',
      'فيس بوك': 'فيسبوك',
      'انستقرام': 'إنستغرام',
      'ريسبونسيف': 'responsive',
      'مودرن': 'modern',
    };

    for (const [wrong, correct] of Object.entries(corrections)) {
      normalized = normalized.replace(new RegExp(wrong, 'gi'), correct);
    }

    return normalized;
  }

  /**
   * Map extracted color to colorScheme
   */
  static mapColorToScheme(color: string): any {
    const colorToScheme: Record<string, string> = {
      blue: 'أزرق المحيط',
      purple: 'بنفسجي ملكي',
      green: 'أخضر الطبيعة',
      red: 'أحمر ناري',
      orange: 'برتقالي دافئ',
    };

    const schemeName = colorToScheme[color] || colorSchemes[0].name;
    return colorSchemes.find((s) => s.name === schemeName) || colorSchemes[0];
  }

  /**
   * Get confidence score for extraction
   * Based on number of keywords found
   */
  static getConfidenceScore(keywords: ExtractedKeywords): number {
    let score = 0;
    let maxScore = 0;

    // Industry (20 points)
    maxScore += 20;
    if (keywords.industry && keywords.industry.length > 0) score += 20;

    // Business name (20 points)
    maxScore += 20;
    if (keywords.businessName) score += 20;

    // Contact (30 points - 10 each)
    maxScore += 30;
    if (keywords.contact?.phone) score += 10;
    if (keywords.contact?.email) score += 10;
    if (keywords.contact?.address) score += 10;

    // Colors (15 points)
    maxScore += 15;
    if (keywords.colors && keywords.colors.length > 0) score += 15;

    // Technical terms (15 points)
    maxScore += 15;
    if (keywords.mixed && keywords.mixed.length > 0) score += 15;

    return score / maxScore;
  }
}
