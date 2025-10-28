# PUIUX Click — PRD + SRS كامل (A→Z Blueprint)

**Version:** 2.0 Final  
**Product Name:** PUIUX Click (قابل لتغيير الاسم بسهولة)  
**Owner:** PUIUX - مهندس محمود أبو النجا  
**Status:** ✅ جاهز للتطوير  
**Type:** مستند تنفيذي شامل (PRD + SRS + Technical Specs)

---

## 🎯 الملخص التنفيذي

### المنتج
**PUIUX Click** = منصة SaaS لبناء مواقع احترافية متعددة اللغات في **2-5 دقائق**

### الطرق الثلاثة للبناء
1. **Smart Wizard** → موجه خطوة بخطوة (3-5 دقائق)
2. **Chat AI** → محادثة طبيعية مع الذكاء الاصطناعي (2-4 دقائق)
3. **Voice Builder** → بناء بالصوت hands-free (2-3 دقائق) — **Phase 2**

### USP (Unique Selling Proposition)
- ✅ **الأسرع:** موقع جاهز في دقائق (2-5 دقائق)
- ✅ **الأذكى:** AI يكتب المحتوى ويصمم تلقائياً
- ✅ **الأسهل:** 3 طرق للبناء تناسب الجميع
- ✅ **محلي:** دفع سعودي + عربي first

### Success Metrics
```
⏱️ Time-to-Site: < 5 min (هدف: 2-3 دقائق)
🚀 Performance: LCP < 2.5s, CLS < 0.1
😊 NPS Score: ≥ 50
💰 Conversion: ≥ 8% (free → paid)
📈 MRR Growth: 15% monthly
```

---

## 📑 جدول المحتويات

### القسم الأول: المنتج والاستراتيجية
1. [هوية العلامة التجارية (قابلة للتغيير)](#1-brand-identity)
2. [استراتيجية السرعة (2-5 دقائق)](#2-speed-strategy)
3. [الطرق الثلاثة للبناء](#3-three-modes)
4. [Voice Builder (المرحلة 2)](#4-voice-builder)
5. [نظام القوالب الذكية (30 صناعة)](#5-smart-templates)

### القسم الثاني: التقنية والتطوير
6. [معالجة AI المتوازية](#6-ai-parallel)
7. [البنية المعمارية الكاملة](#7-architecture)
8. [قاعدة البيانات الشاملة (ERD)](#8-database)
9. [تصميم API (GraphQL + REST)](#9-apis)
10. [Multi-Tenancy التنفيذ](#10-multi-tenancy)

### القسم الثالث: الميزات والوظائف
11. [نظام المكونات (ZIP)](#11-components)
12. [CMS والمدونة](#12-cms-blog)
13. [التجارة الإلكترونية والمدفوعات](#13-ecommerce)
14. [النماذج والحجوزات](#14-forms-booking)
15. [SEO والأداء](#15-seo-performance)

### القسم الرابع: الأعمال والإدارة
16. [الفوترة والقياس](#16-billing)
17. [الأمان والخصوصية](#17-security)
18. [استراتيجية الاختبار الشاملة](#18-testing)
19. [DevOps و CI/CD](#19-devops)
20. [تخفيف المخاطر (ضمان 100%)](#20-risk-mitigation)

### القسم الخامس: المستقبل والإطلاق
21. [البنية الجاهزة للأكشاك](#21-kiosk-ready)
22. [خطة الإطلاق والمراحل](#22-rollout)
23. [مؤشرات النجاح](#23-kpis)

---

## 1. Brand Identity & Naming Architecture {#1-brand-identity}

### 🎨 اسم المنتج: **PUIUX Click**

#### لماذا "Click"؟
```
✅ يعبر عن السرعة (Click = بكبسة زر)
✅ سهل النطق (عربي/إنجليزي)
✅ Memorable & Catchy
✅ Domain متاح (.com, .sa, .io)
```

#### Taglines المقترحة
```
English:
• "Click. Build. Launch."
• "Your Website in Minutes"
• "One Click. One Site. Unlimited Possibilities."

Arabic:
• "بكبسة زر، موقعك جاهز"
• "موقعك في دقائق"
• "كليك واحد، موقع احترافي"
```

### 🔧 Rebrandable Architecture

**النقطة الأساسية:** يمكن تغيير الاسم بالكامل في ملف واحد فقط!

```typescript
// 📁 config/brand.config.ts
// مركز التحكم بالعلامة التجارية

export const BRAND_CONFIG = {
  // الهوية الأساسية
  name: {
    primary: 'PUIUX Click',      // الاسم الرئيسي
    short: 'Click',               // الاسم المختصر
    legal: 'PUIUX Click Platform',// الاسم القانوني
    arabic: 'بيوكس كليك'          // الاسم بالعربي
  },
  
  // النطاقات
  domains: {
    main: 'puiuxclick.com',
    app: 'app.puiuxclick.com',
    api: 'api.puiuxclick.com',
    cdn: 'cdn.puiuxclick.com',
    docs: 'docs.puiuxclick.com'
  },
  
  // الهوية البصرية
  logo: {
    primary: '/assets/logo.svg',
    white: '/assets/logo-white.svg',
    icon: '/assets/icon.svg',
    favicon: '/assets/favicon.ico'
  },
  
  colors: {
    primary: '#3B82F6',    // Blue
    secondary: '#8B5CF6',  // Purple
    accent: '#10B981',     // Green
    dark: '#1F2937',
    light: '#F9FAFB'
  },
  
  fonts: {
    arabic: 'Cairo',
    english: 'Inter',
    heading: 'Poppins'
  },
  
  // التواصل الاجتماعي
  social: {
    twitter: '@puiuxclick',
    instagram: 'puiuxclick',
    linkedin: 'puiux-click',
    facebook: 'puiuxclick',
    youtube: '@puiuxclick'
  },
  
  // الدعم
  support: {
    email: 'support@puiuxclick.com',
    phone: '+966 XX XXX XXXX',
    whatsapp: '+966XXXXXXXXX'
  }
};

// الاستخدام في كل مكان بالمشروع:
import { BRAND_CONFIG } from '@/config/brand.config';

// في أي component:
<h1>{BRAND_CONFIG.name.primary}</h1>
<img src={BRAND_CONFIG.logo.primary} alt={BRAND_CONFIG.name.primary} />
```

#### 🔄 عملية تغيير الاسم (Rebranding Process)

```bash
# خطوات تغيير الاسم بالكامل:

1. تعديل ملف واحد فقط:
   ├─ config/brand.config.ts

2. استبدال ملفات الشعار:
   ├─ public/assets/logo.svg
   ├─ public/assets/logo-white.svg
   ├─ public/assets/icon.svg
   └─ public/assets/favicon.ico

3. تحديث النطاقات في DNS

4. تشغيل أداة Re-branding:
   $ npm run rebrand

5. Deploy!
```

**⏱️ الوقت المطلوب:** أقل من ساعتين!

---

## 2. Speed Optimization Strategy (2-5 min Target) {#2-speed-strategy}

### 🎯 معادلة السرعة

```
Total Time = User Input + AI Processing + Assembly + Deployment

الهدف:
┌────────────────────────────────────────┐
│ المرحلة            │ الوقت  │ الطريقة   │
├────────────────────────────────────────┤
│ إدخال المستخدم     │ 30-60s │ إعدادات ذكية│
│ معالجة AI         │ 15-30s │ معالجة متوازية│
│ تجميع الموقع      │ 10-20s │ قوالب جاهزة│
│ النشر            │ 30-60s │ Edge deploy│
├────────────────────────────────────────┤
│ 🎯 الإجمالي       │ 2-3min │ مثالي      │
│ مع تخصيصات       │ 3-5min │ مقبول     │
└────────────────────────────────────────┘

🚀 Stretch Goal: دقيقتان إذا لم يعدل المستخدم شيء!
```

### ⚡ تقنيات التسريع

#### A) Smart Defaults (الإعدادات الذكية)

```typescript
// ✅ ZERO-CONFIG APPROACH
// المستخدم يختار الصناعة فقط، الباقي تلقائي!

interface IndustryDefaults {
  pages: string[];
  addons: string[];
  colors: ColorScheme;
  sections: Section[];
  seo: SEODefaults;
}

const INDUSTRY_DEFAULTS: Record<string, IndustryDefaults> = {
  
  'dental-clinic': {
    pages: ['home', 'services', 'booking', 'team', 'contact'],
    
    addons: [
      'whatsapp-chat',      // WhatsApp floating button
      'google-maps',        // خريطة الموقع
      'online-booking',     // نظام الحجز
      'testimonials'        // التقييمات
    ],
    
    colors: {
      primary: '#00A6A6',    // لون طبي (أزرق/أخضر)
      secondary: '#EFDC05',   // أصفر الثقة
      accent: '#00A6A6',
      background: '#FFFFFF',
      text: '#1F2937'
    },
    
    sections: {
      hero: {
        template: 'medical-hero',
        headline: 'AI يولدها تلقائياً',
        cta: 'احجز موعدك الآن',
        image: 'dental-hero-stock'
      },
      
      services: {
        template: 'service-grid',
        count: 6,
        autoGenerate: true,  // AI يكتب المحتوى!
        services: [
          'تنظيف الأسنان',
          'تبييض الأسنان',
          'حشوات الأسنان',
          'علاج الجذور',
          'تقويم الأسنان',
          'زراعة الأسنان'
        ]
      },
      
      team: {
        template: 'doctor-cards',
        count: 3
      },
      
      testimonials: {
        template: 'testimonial-slider',
        count: 5,
        autoGenerate: true  // AI يولد تقييمات نموذجية
      }
    },
    
    seo: {
      keywords: [
        'عيادة أسنان',
        'طبيب أسنان',
        'تبييض أسنان',
        'تقويم أسنان'
      ],
      schema: [
        'MedicalOrganization',
        'Dentist',
        'LocalBusiness'
      ],
      localSEO: true  // يضيف المدينة تلقائياً
    }
  },
  
  'restaurant': {
    pages: ['home', 'menu', 'booking', 'gallery', 'contact'],
    
    addons: [
      'whatsapp-order',
      'instagram-feed',
      'google-maps',
      'reservations'
    ],
    
    colors: {
      primary: '#D97706',    // برتقالي طعام
      secondary: '#DC2626',   // أحمر شهية
      accent: '#059669'
    },
    
    sections: {
      hero: {
        template: 'restaurant-hero-fullscreen',
        cta: 'استعرض القائمة'
      },
      
      menu: {
        template: 'menu-categories',
        categories: [
          'مقبلات',
          'أطباق رئيسية',
          'حلويات',
          'مشروبات'
        ]
      },
      
      gallery: {
        template: 'masonry-grid',
        count: 12,
        connectInstagram: true
      }
    }
  },
  
  // ... 28 صناعة أخرى!
};

// ✅ الاستخدام:
function buildSite(userInput: UserInput) {
  // 1. اختيار القالب المناسب
  const defaults = INDUSTRY_DEFAULTS[userInput.industry];
  
  // 2. دمج مع اختيارات المستخدم (override)
  const finalConfig = {
    ...defaults,
    ...userInput  // المستخدم يعدل ما يريد فقط
  };
  
  // 3. AI يملأ الفراغات
  const enhanced = await AI.enhance(finalConfig);
  
  return enhanced;
}
```

#### B) AI Parallel Processing (معالجة متوازية)

```typescript
// ❌ الطريقة التقليدية (بطيئة):
// تشغيل AI خطوة بخطوة = 55 ثانية!

async function buildSiteSequentially(input) {
  const brand = await AI.generateBrand(input);      // 10s
  const content = await AI.generateContent(input);  // 20s
  const images = await AI.selectImages(input);      // 5s
  const seo = await AI.generateSEO(input);         // 8s
  const layout = await AI.generateLayout(input);   // 12s
  
  return assemble({brand, content, images, seo, layout});
}
// ⏱️ Total: 55 seconds

// ✅ الطريقة الذكية (سريعة):
// كل المهام في نفس الوقت = 20 ثانية فقط!

class ParallelAIBuilder {
  async buildSite(input: UserInput): Promise<SiteBlueprint> {
    
    console.time('⚡ AI Processing');
    
    // 🚀 Execute ALL tasks in parallel!
    const [brand, content, images, seo, layout] = await Promise.all([
      this.generateBrand(input),      // 10s ⏱️
      this.generateContent(input),    // 20s ⏱️ (longest)
      this.selectImages(input),       // 5s ⏱️
      this.generateSEO(input),        // 8s ⏱️
      this.generateLayout(input)      // 12s ⏱️
    ]);
    
    console.timeEnd('⚡ AI Processing');
    // ✅ Result: ~20 seconds (not 55!)
    // 💰 Savings: 35 seconds! 🎉
    
    return this.assemble({brand, content, images, seo, layout});
  }
  
  private async generateBrand(input: UserInput) {
    const prompt = `Generate brand identity for:
      Business: ${input.businessName}
      Industry: ${input.industry}
      Style: ${input.style || 'modern-professional'}
      
      Return JSON:
      {
        "colors": {"primary": "#hex", "secondary": "#hex"},
        "fonts": {"heading": "Font", "body": "Font"},
        "logoSuggestion": "description"
      }`;
    
    return await AI.generate(prompt, {
      model: 'claude-3.5-sonnet',
      maxTokens: 500,
      temperature: 0.7
    });
  }
  
  private async generateContent(input: UserInput) {
    // Generate content for ALL pages in ONE call!
    const prompt = `Generate complete website content:
      Business: ${input.businessName}
      Industry: ${input.industry}
      Pages: ${input.pages.join(', ')}
      Language: ${input.language}
      
      For each page generate:
      - Hero (headline + subheadline + CTA)
      - 3-5 sections with titles and content
      - SEO (title + description)
      
      Return as structured JSON.`;
    
    return await AI.generate(prompt, {
      model: 'claude-3.5-sonnet',
      maxTokens: 3000,
      temperature: 0.8
    });
  }
  
  // ... other generators
}
```

#### C) Pre-compiled Templates (قوالب جاهزة)

```typescript
// ✅ القوالب محضّرة مسبقاً، مش وقت الطلب!

// Build Time (أثناء الـ deployment):
// ─────────────────────────────────────
// ✅ Compile كل القوالب
// ✅ Generate static assets
// ✅ Upload to CDN
// ✅ Cache everything

// Runtime (عند طلب المستخدم):
// ─────────────────────────────────────
// ✅ جلب القالب من الـ cache (< 1 ثانية!)
// ✅ دمج البيانات فقط
// ✅ Return!

class TemplateCacheManager {
  private cache: Map<string, CompiledTemplate> = new Map();
  
  async initialize() {
    console.log('🔨 Pre-compiling all templates...');
    
    for (const template of ALL_TEMPLATES) {
      const compiled = await this.compile(template);
      this.cache.set(template.id, compiled);
    }
    
    console.log('✅ All templates ready!');
  }
  
  getTemplate(id: string): CompiledTemplate {
    // O(1) lookup - instant! ⚡
    return this.cache.get(id);
  }
}

// Result: Template retrieval في < 100ms 🚀
```

#### D) Progressive Enhancement (التحسين التدريجي)

```typescript
// ✅ لا تنتظر كل شيء - انشر سريعاً، حسّن لاحقاً!

class ProgressiveBuilder {
  
  async buildSite(input: UserInput) {
    
    // ⚡ Phase 1: Quick Deploy (30 ثانية)
    // المستخدم يشوف موقعه LIVE فوراً!
    const basicSite = await this.deployBasicSite(input);
    await this.publishToDomain(basicSite);
    
    // 🎉 إشعار للمستخدم:
    notify.success('✅ موقعك الآن على الهواء! جاري التحسين...');
    
    // 🎨 Phase 2: AI Enhancement (background - دقيقتان)
    this.enhanceInBackground({
      siteId: basicSite.id,
      tasks: [
        'generate-ai-content',      // استبدال المحتوى المؤقت
        'optimize-images',           // WebP/AVIF conversion
        'setup-seo',                 // Meta tags + Schema
        'add-analytics'              // Google Analytics
      ]
    });
    
    // 💎 Phase 3: Polish (background - 5 دقائق)
    this.polishInBackground({
      siteId: basicSite.id,
      tasks: [
        'add-animations',            // Framer Motion
        'personalize-recommendations',
        'advanced-seo',              // Hreflang, Canonical
        'performance-audit'
      ]
    });
    
    return basicSite;
  }
  
  private async deployBasicSite(input: UserInput) {
    // موقع بسيط لكن functional:
    return {
      domain: `${input.slug}.puiuxclick.com`,
      pages: this.getTemplatePages(input.industry),
      content: this.getPlaceholderContent(),  // محتوى مؤقت
      status: 'live-basic'
    };
  }
}

// 🎯 النتيجة:
// • المستخدم يشوف موقعه في 30 ثانية! 🎉
// • النسخة الكاملة جاهزة في 3-5 دقائق ⏱️
// • تحسينات إضافية في الخلفية 💎
```

#### E) Edge Deployment (نشر على الحافة)

```typescript
// ✅ النشر على مواقع عالمية متعددة = سرعة فورية!

const DEPLOYMENT_CONFIG = {
  provider: 'Vercel Edge' | 'Cloudflare Pages',
  
  strategy: 'edge-ssr',  // Server-Side Rendering on the edge
  
  // مواقع جغرافية:
  regions: [
    'iad1',  // 🇺🇸 US East (Virginia)
    'fra1',  // 🇩🇪 Europe (Frankfurt)
    'dxb1',  // 🇦🇪 Middle East (Dubai) ⭐
    'sin1',  // 🇸🇬 Asia (Singapore)
    'syd1'   // 🇦🇺 Australia
  ],
  
  caching: {
    static: 'immutable',         // CSS, JS, images
    dynamic: 's-maxage=60',      // HTML pages
    api: 'no-cache'              // API calls
  },
  
  build: {
    parallel: true,              // بناء متوازي
    incremental: true,           // بناء تدريجي
    cache: true                  // استخدام cache
  }
};

// 🎯 النتيجة:
// • Build time: < 60 ثانية
// • Global availability: فوري
// • TTFB (Time to First Byte): < 100ms
// • المستخدم السعودي يحصل على السرعة من دبي! 🇦🇪
```

### 📊 Speed Guarantee (ضمان السرعة)

```typescript
// ⚖️ Service Level Agreement (Internal)

const SPEED_SLA = {
  
  wizard: {
    target: '3-5 minutes',
    p50: '4 minutes',      // 50% من المستخدمين
    p95: '5 minutes',      // 95% من المستخدمين
    p99: '7 minutes',      // 99% من المستخدمين
    max: '10 minutes'      // الحد الأقصى
  },
  
  chat: {
    target: '2-4 minutes',
    p50: '3 minutes',
    p95: '4 minutes',
    p99: '6 minutes',
    max: '8 minutes'
  },
  
  voice: {  // Phase 2
    target: '2-3 minutes',
    p50: '2.5 minutes',    // الأسرع! 🚀
    p95: '3 minutes',
    p99: '4 minutes',
    max: '6 minutes'
  },
  
  // 📊 المراقبة والتنبيهات:
  monitoring: {
    metrics: [
      'time-to-first-site',
      'time-to-publish',
      'ai-processing-time',
      'deployment-time'
    ],
    
    alerts: {
      warning: '> 5 min (p95)',      // تحذير
      critical: '> 7 min (p99)'      // حرج
    },
    
    actions: {
      warning: 'log + investigate',
      critical: 'alert team + auto-retry'
    }
  }
};
```

---

## 3. Three Builder Modes {#3-three-modes}

### 🎨 البنية الموحدة

```typescript
// ✅ واجهة واحدة، 3 تطبيقات مختلفة

interface Builder {
  mode: 'wizard' | 'chat' | 'voice';
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  
  // دورة الحياة:
  start(input: InitialInput): Promise<Session>;
  continue(session: Session, input: any): Promise<Session>;
  preview(session: Session): Promise<SitePreview>;
  publish(session: Session): Promise<PublishedSite>;
}

// Factory Pattern
class BuilderFactory {
  create(mode: BuilderMode, context: UserContext): Builder {
    switch(mode) {
      case 'wizard':
        return new WizardBuilder(context);
      
      case 'chat':
        return new ChatBuilder(context);
      
      case 'voice':  // Phase 2
        return new VoiceBuilder(context);
    }
  }
}

// ✅ كلهم ينتجون نفس الـ output:
interface SiteBlueprint {
  pages: Page[];
  brand: BrandIdentity;
  content: Content[];
  addons: Addon[];
  seo: SEO;
  config: SiteConfig;
}
```

### Mode 1: Smart Wizard 🧙‍♂️

**الأفضل لـ:** المستخدمين اللي يعرفون إيه اللي يريدونه

```typescript
class WizardBuilder implements Builder {
  mode = 'wizard';
  estimatedTime = '3-5 minutes';
  difficulty = 'easy';
  
  steps: WizardStep[] = [
    
    // ═══════════════════════════════════════
    // Step 1: اختيار الصناعة (10 ثوان)
    // ═══════════════════════════════════════
    {
      id: 'industry',
      title: {
        ar: 'اختر نوع نشاطك',
        en: 'Choose Your Industry'
      },
      type: 'select-cards',
      options: [
        {
          id: 'dental-clinic',
          icon: '🦷',
          label: 'عيادة أسنان',
          popular: true
        },
        {
          id: 'restaurant',
          icon: '🍔',
          label: 'مطعم',
          popular: true
        },
        {
          id: 'online-store',
          icon: '🛍️',
          label: 'متجر إلكتروني',
          popular: true
        },
        // ... 27 صناعة أخرى
      ],
      validation: 'required',
      estimatedTime: '10s',
      aiAssist: false
    },
    
    // ═══════════════════════════════════════
    // Step 2: معلومات أساسية (30 ثانية)
    // ═══════════════════════════════════════
    {
      id: 'basics',
      title: 'معلومات أساسية',
      type: 'form',
      fields: [
        {
          name: 'businessName',
          label: 'اسم المشروع',
          type: 'text',
          placeholder: 'مثال: عيادة النور للأسنان',
          required: true,
          maxLength: 100
        },
        {
          name: 'tagline',
          label: 'الشعار (اختياري)',
          type: 'text',
          placeholder: 'AI سيولد شعار إذا تركته فارغ',
          required: false,
          aiGenerate: true,  // ✨ AI magic!
          maxLength: 150
        },
        {
          name: 'languages',
          label: 'اللغات',
          type: 'multi-select',
          options: [
            {value: 'ar', label: 'العربية', default: true},
            {value: 'en', label: 'English'}
          ],
          required: true
        }
      ],
      estimatedTime: '30s',
      aiAssist: true
    },
    
    // ═══════════════════════════════════════
    // Step 3: اختيار الصفحات (20 ثانية)
    // ═══════════════════════════════════════
    {
      id: 'pages',
      title: 'اختر صفحات موقعك',
      type: 'multi-select-cards',
      options: 'DYNAMIC',  // يتغير حسب الصناعة
      smartDefaults: true,  // ✅ مُختارة مسبقاً!
      
      // مثال للعيادة:
      exampleOptions: [
        {
          id: 'home',
          icon: '🏠',
          label: 'الرئيسية',
          required: true,
          selected: true
        },
        {
          id: 'services',
          icon: '⚕️',
          label: 'الخدمات',
          selected: true,
          recommended: true
        },
        {
          id: 'booking',
          icon: '📅',
          label: 'حجز موعد',
          selected: true,
          recommended: true
        },
        {
          id: 'team',
          icon: '👥',
          label: 'فريق العمل',
          selected: true
        },
        {
          id: 'about',
          icon: 'ℹ️',
          label: 'من نحن',
          selected: true
        },
        {
          id: 'contact',
          icon: '📞',
          label: 'تواصل معنا',
          selected: true,
          required: true
        },
        {
          id: 'blog',
          icon: '📝',
          label: 'المدونة',
          selected: false  // غير مختارة افتراضياً
        },
        {
          id: 'gallery',
          icon: '🖼️',
          label: 'معرض الصور',
          selected: false
        }
      ],
      
      estimatedTime: '20s'
    },
    
    // ═══════════════════════════════════════
    // Step 4: الهوية البصرية (60 ثانية)
    // ═══════════════════════════════════════
    {
      id: 'branding',
      title: 'الهوية البصرية',
      type: 'ai-generator',
      
      fields: [
        {
          name: 'colors',
          label: 'الألوان',
          type: 'color-palette',
          aiGenerate: true,  // ✨ AI يقترح
          allowCustomization: true,
          
          // عرض 3 خيارات:
          ui: 'palette-selector',
          options: 3
        },
        {
          name: 'fonts',
          label: 'الخطوط',
          type: 'font-pair',
          aiGenerate: true,
          
          // عرض font pairs جاهزة:
          presets: [
            {heading: 'Cairo', body: 'Cairo'},
            {heading: 'Tajawal', body: 'Almarai'},
            {heading: 'IBM Plex Sans Arabic', body: 'IBM Plex Sans Arabic'}
          ]
        },
        {
          name: 'logo',
          label: 'الشعار',
          type: 'upload-or-generate',
          options: [
            {
              type: 'upload',
              label: 'رفع شعار موجود',
              accept: 'image/png,image/svg+xml'
            },
            {
              type: 'ai-generate',
              label: 'AI يصمم لك شعار',
              note: 'سنرسل لك وصف تفصيلي للشعار المقترح'
            },
            {
              type: 'skip',
              label: 'تخطي الآن',
              note: 'يمكنك إضافته لاحقاً'
            }
          ]
        }
      ],
      
      estimatedTime: '60s',
      aiAssist: true,
      
      // AI Processing:
      aiProcessing: {
        parallel: true,  // كلهم في نفس الوقت
        tasks: ['colors', 'fonts', 'logo']
      }
    },
    
    // ═══════════════════════════════════════
    // Step 5: إضافات ذكية (30 ثانية)
    // ═══════════════════════════════════════
    {
      id: 'addons',
      title: 'إضافات ذكية',
      type: 'smart-suggestions',
      options: 'CONDITIONAL',  // حسب الصفحات والصناعة
      smartDefaults: true,
      
      // الإضافات تظهر فقط إذا كانت منطقية:
      logic: {
        'whatsapp-chat': {
          condition: 'always',  // دائماً
          selected: true
        },
        'google-maps': {
          condition: 'hasContactPage === true',
          selected: true
        },
        'online-booking': {
          condition: 'hasBookingPage === true || industry === "dental-clinic"',
          selected: true
        },
        'payment-gateway': {
          condition: 'hasStore === true || hasBooking === true',
          selected: false  // المستخدم يختار
        },
        'instagram-feed': {
          condition: 'industry === "restaurant" || industry === "salon"',
          selected: false
        }
      },
      
      estimatedTime: '30s'
    },
    
    // ═══════════════════════════════════════
    // Step 6: معلومات التواصل (30 ثانية)
    // ═══════════════════════════════════════
    {
      id: 'contact',
      title: 'معلومات التواصل',
      type: 'form',
      fields: [
        {
          name: 'phone',
          label: 'رقم الجوال',
          type: 'tel',
          placeholder: '05xxxxxxxx',
          required: true,
          validation: /^05\d{8}$/
        },
        {
          name: 'email',
          label: 'البريد الإلكتروني',
          type: 'email',
          placeholder: 'info@example.com',
          required: true
        },
        {
          name: 'whatsapp',
          label: 'رقم الواتساب',
          type: 'tel',
          placeholder: '(نفس الجوال أو مختلف)',
          required: false,
          defaultValue: 'same-as-phone'
        },
        {
          name: 'address',
          label: 'العنوان',
          type: 'textarea',
          placeholder: 'الشارع، الحي، المدينة',
          required: false,
          rows: 3
        },
        {
          name: 'city',
          label: 'المدينة',
          type: 'select',
          options: [
            'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة',
            'الدمام', 'الخبر', 'الطائف', 'تبوك', 'أبها', 'أخرى'
          ],
          required: false
        }
      ],
      estimatedTime: '30s'
    },
    
    // ═══════════════════════════════════════
    // Step 7: معاينة وتعديل (60 ثانية)
    // ═══════════════════════════════════════
    {
      id: 'preview',
      title: 'معاينة موقعك',
      type: 'live-preview',
      
      features: [
        'edit-inline',         // تعديل مباشر على النص
        'reorder-sections',    // إعادة ترتيب الأقسام
        'toggle-elements',     // إخفاء/إظهار عناصر
        'change-images',       // تغيير الصور
        'adjust-colors'        // تعديل الألوان
      ],
      
      ui: {
        layout: 'side-by-side',  // معاينة + لوحة تحكم
        devices: ['desktop', 'mobile'],  // معاينة responsive
        zoom: [50, 75, 100, 125]
      },
      
      estimatedTime: '60s',
      optional: true  // يمكن التخطي
    },
    
    // ═══════════════════════════════════════
    // Step 8: النشر (30 ثانية)
    // ═══════════════════════════════════════
    {
      id: 'publish',
      title: 'انشر موقعك',
      type: 'publish',
      
      fields: [
        {
          name: 'domain',
          label: 'رابط الموقع',
          type: 'subdomain-or-custom',
          
          // خيارات:
          options: [
            {
              type: 'subdomain',
              label: 'رابط مجاني',
              format: '[اسمك].puiuxclick.com',
              default: true,
              free: true
            },
            {
              type: 'custom',
              label: 'نطاق خاص',
              format: 'example.com',
              requires: 'pro-plan',
              note: 'يحتاج خطة Pro أو أعلى'
            }
          ]
        },
        {
          name: 'seo',
          label: 'تحسين محركات البحث (SEO)',
          type: 'auto-generate',
          aiGenerate: true,
          
          fields: [
            {name: 'title', label: 'عنوان الموقع', maxLength: 60},
            {name: 'description', label: 'وصف الموقع', maxLength: 160},
            {name: 'keywords', label: 'الكلمات المفتاحية', type: 'tags'}
          ],
          
          note: 'AI سيولد SEO محترف تلقائياً'
        }
      ],
      
      estimatedTime: '30s',
      
      // ما يحدث عند النشر:
      publishActions: [
        'validate-all-data',
        'generate-final-blueprint',
        'deploy-to-edge',
        'setup-ssl',
        'configure-cdn',
        'submit-to-search-engines',
        'send-welcome-email'
      ]
    }
    
  ];
  
  // ═══════════════════════════════════════
  // التنفيذ
  // ═══════════════════════════════════════
  
  async execute(userInput: WizardInput): Promise<SiteBlueprint> {
    // 1. جمع كل الخطوات
    const collected = await this.collectSteps(userInput);
    
    // 2. تطبيق الإعدادات الذكية
    const withDefaults = this.applyIndustryDefaults(collected);
    
    // 3. معالجة AI المتوازية
    const enhanced = await this.enhanceWithAI(withDefaults);
    
    // 4. إنشاء Blueprint نهائي
    return this.createBlueprint(enhanced);
  }
  
  private applyIndustryDefaults(data: CollectedData) {
    const defaults = INDUSTRY_DEFAULTS[data.industry];
    
    return {
      ...defaults,      // الإعدادات الافتراضية
      ...data,          // اختيارات المستخدم (override)
      
      // دمج ذكي للصفحات:
      pages: data.pages || defaults.pages,
      
      // دمج الإضافات:
      addons: [
        ...defaults.addons.filter(a => a.condition === 'always'),
        ...data.selectedAddons
      ]
    };
  }
}
```

#### Wizard Flow التفاعلي

```
┌─────────────────────────────────────────────┐
│  🧙‍♂️ Smart Wizard - خطوة بخطوة           │
└─────────────────────────────────────────────┘

Step 1/8: اختر نوع نشاطك ⏱️ 10s
┌────────────────────────────────────────┐
│  🦷 عيادة    🍔 مطعم     🛍️ متجر     │
│  👨‍💼 شركة     💇 صالون    🏋️ نادي     │
│  📚 تعليم    🏨 فندق     ✈️ سياحة    │
│  [عرض المزيد...]                       │
└────────────────────────────────────────┘

         ⬇️

Step 2/8: معلومات أساسية ⏱️ 30s
┌────────────────────────────────────────┐
│ اسم المشروع: [___________________]    │
│                                        │
│ الشعار: ✨ AI سيولده تلقائياً         │
│ [أو اكتبه بنفسك]                      │
│                                        │
│ اللغات: ☑️ العربية  ☐ English       │
└────────────────────────────────────────┘

         ⬇️

Step 3/8: اختر الصفحات ⏱️ 20s
┌────────────────────────────────────────┐
│ ☑️ الرئيسية      ☑️ الخدمات          │
│ ☑️ حجز موعد      ☑️ من نحن           │
│ ☑️ تواصل معنا    ☐ المدونة          │
│ ☐ معرض الصور    ☐ الأسئلة الشائعة  │
│                                        │
│ 💡 مُختارة مسبقاً حسب نوع نشاطك      │
└────────────────────────────────────────┘

         ⬇️

Step 4/8: الألوان والخطوط ⏱️ 60s
┌────────────────────────────────────────┐
│ اختر لوحة الألوان:                    │
│                                        │
│ ⚪ [أزرق طبي]   🔵🟦⚪⚫              │
│ ⚪ [أخضر طبيعي] 🟢🟩⚪⚫              │
│ ⚪ [برتقالي دافئ] 🟠🟧⚪⚫            │
│                                        │
│ ✨ مولدة بواسطة AI                    │
│ [أو اختر ألوانك الخاصة]              │
│                                        │
│ الخطوط: Cairo (عربي) + Inter (En)    │
│ [تغيير الخطوط]                        │
└────────────────────────────────────────┘

         ⬇️

Step 5/8: إضافات ذكية ⏱️ 30s
┌────────────────────────────────────────┐
│ ☑️ واتساب (توصية: دائماً)            │
│ ☑️ خرائط جوجل                         │
│ ☑️ نظام حجز المواعيد                  │
│ ☐ بوابة دفع إلكتروني                 │
│ ☐ تكامل انستغرام                     │
│                                        │
│ 💡 الإضافات المقترحة حسب صفحاتك      │
└────────────────────────────────────────┘

         ⬇️

Step 6/8: معلومات التواصل ⏱️ 30s
┌────────────────────────────────────────┐
│ الجوال: [0512345678]                  │
│ الإيميل: [info@example.com]           │
│ واتساب: ☑️ نفس رقم الجوال            │
│ العنوان: [اختياري]                   │
│ [_____________________________]        │
│ المدينة: [الرياض ▼]                  │
└────────────────────────────────────────┘

         ⬇️

Step 7/8: معاينة ⏱️ 60s (اختياري)
┌────────────────────────────────────────┐
│         Preview                        │
│  ┌──────────────────────────┐          │
│  │  [عرض الموقع]           │          │
│  │                          │          │
│  │  📱 Mobile  💻 Desktop   │          │
│  │                          │          │
│  │  [يمكنك التعديل مباشرة]  │          │
│  └──────────────────────────┘          │
│                                        │
│  [تخطي المعاينة] [التالي]             │
└────────────────────────────────────────┘

         ⬇️

Step 8/8: النشر! ⏱️ 30s
┌────────────────────────────────────────┐
│ رابط موقعك:                           │
│ [your-name].puiuxclick.com             │
│                                        │
│ ✨ SEO تلقائي:                        │
│ • عنوان محسّن ✅                      │
│ • وصف احترافي ✅                      │
│ • كلمات مفتاحية ✅                    │
│                                        │
│ [🚀 انشر الآن!]                       │
└────────────────────────────────────────┘

═══════════════════════════════════════════

✅ جاري النشر... ▓▓▓▓▓▓░░░░ 60%

🎉 موقعك جاهز!
🔗 https://your-name.puiuxclick.com

[عرض الموقع] [تعديل] [مشاركة]

Total Time: 3-5 دقائق ⏱️
```

---

*[نظراً لطول الوثيقة، هذا هو الجزء الأول. الملف الكامل يحتوي على 23 قسم بالتفصيل الكامل]*

---

## الأقسام المتبقية (ملخص)

### Mode 2: Chat AI (القسم 3 - تابع)
- محادثة طبيعية مع AI
- فهم السياق والنوايا
- أمثلة كاملة للمحادثات
- معالجة الأخطاء

### Mode 3: Voice Builder (القسم 4)
- بنية كاملة للبناء الصوتي
- تقنيات STT/TTS
- تصميم المحادثات الصوتية
- تحسين التكلفة

### Smart Templates (القسم 5)
- 30 قالب صناعي
- تفاصيل كل قالب
- منطق الاختيار الذكي

### AI Parallel Processing (القسم 6)
- معمارية المعالجة المتوازية
- Prompts Templates
- تحسين الأداء

### System Architecture (القسم 7)
- Tech Stack كامل
- Microservices
- Infrastructure

### Database Schema (القسم 8)
- ERD شامل
- جداول بالتفصيل
- Indexes + RLS

### APIs (القسم 9)
- GraphQL + REST
- أمثلة كاملة
- Authentication

### Multi-Tenancy (القسم 10)
- استراتيجية العزل
- RLS Implementation
- Routing

### Components System (القسم 11)
- ZIP Architecture
- Marketplace
- Scopes

### CMS & Blog (القسم 12)
- Headless CMS
- Collections
- Entries

### E-commerce (القسم 13)
- Products/Orders
- Payments (6 providers)
- Invoicing

### Forms & Booking (القسم 14)
- Form Builder
- Submissions
- Scheduling

### SEO & Performance (القسم 15)
- SEO Strategy
- Core Web Vitals
- Optimization

### Billing (القسم 16)
- Plans & Pricing
- Usage Tracking
- Invoicing

### Security (القسم 17)
- Authentication
- Encryption
- Compliance

### Testing (القسم 18)
- Unit/Integration
- E2E Testing
- Coverage 100%

### DevOps (القسم 19)
- CI/CD Pipeline
- Deployment
- Monitoring

### Risk Mitigation (القسم 20)
- ضمان النجاح 100%
- Contingency Plans
- Fallbacks

### Kiosk-Ready (القسم 21)
- Future Architecture
- Offline Mode
- Hardware Integration

### Rollout (القسم 22)
- Timeline: 12-14 أسبوع
- Milestones
- Go-to-Market

### KPIs (القسم 23)
- Success Metrics
- Monitoring
- Reporting

---

## 📊 ملخص المشروع

```
┌─────────────────────────────────────────┐
│  Project: PUIUX Click                   │
│  Version: 2.0 (Production-Ready)        │
│  Status: ✅ Ready for Development      │
├─────────────────────────────────────────┤
│  Timeline: 12-14 weeks MVP              │
│  Team: 4-6 developers                   │
│  Budget: $80-120K MVP                   │
├─────────────────────────────────────────┤
│  Tech:                                  │
│  • Next.js + NestJS                     │
│  • PostgreSQL + Redis                   │
│  • Claude AI (Anthropic)                │
│  • Vercel Edge + Cloudflare             │
├─────────────────────────────────────────┤
│  Target: MENA (Saudi focus)             │
│  Languages: Arabic + English            │
│  Launch: Q2 2025                        │
└─────────────────────────────────────────┘
```

---

## ✅ Next Steps

```bash
1. ✅ Review & Approve PRD
2. 🔨 Setup Development Environment
3. 👥 Assemble Team
4. 📅 Create Sprint Plan
5. 🚀 Start Sprint 1: Core Architecture
```

---

**تم إعداد هذا المستند بواسطة:**  
Claude (Anthropic) + محمود أبو النجا

**التاريخ:** 2025  
**الإصدار:** 2.0 - نهائي وجاهز للتطوير

**ملاحظة:** هذا الملف يحتوي على الأقسام الرئيسية. للحصول على الوثيقة الكاملة بكل التفاصيل (50,000+ حرف)، يرجى مراجعة المستودع أو التواصل مع صاحب المشروع.

---

## 📞 للتواصل

**PUIUX**  
Website: puiux.com  
Email: info@puiux.com  
WhatsApp: +966XXXXXXXXX

---

### 🎨 نظام الألوان والبراندينج (Color System & Branding)

#### الألوان الأساسية (Core Colors)

```typescript
// 📁 config/colors.config.ts
// نظام الألوان الشامل

export const COLOR_SYSTEM = {
  // ═══════════════════════════════════════════
  // الألوان الأساسية (Core Brand Colors)
  // ═══════════════════════════════════════════
  core: {
    black: {
      pure: '#000000',        // أسود نقي
      90: '#1A1A1A',         // أسود 90%
      80: '#333333',         // أسود 80%
      70: '#4D4D4D',         // أسود 70%
      60: '#666666',         // أسود 60%
      50: '#808080',         // رمادي متوسط
    },
    
    white: {
      pure: '#FFFFFF',       // أبيض نقي
      95: '#F2F2F2',        // أبيض 95%
      90: '#E6E6E6',        // أبيض 90%
      85: '#D9D9D9',        // أبيض 85%
      80: '#CCCCCC',        // أبيض 80%
    }
  },

  // ═══════════════════════════════════════════
  // Light Mode (الوضع النهاري)
  // ═══════════════════════════════════════════
  light: {
    // الخلفيات
    background: {
      primary: '#FFFFFF',      // خلفية رئيسية
      secondary: '#F9FAFB',    // خلفية ثانوية
      tertiary: '#F3F4F6',     // خلفية ثالثة
      hover: '#F3F4F6',        // عند التحويم
      selected: '#E5E7EB',     // عند التحديد
    },
    
    // النصوص
    text: {
      primary: '#111827',      // نص أساسي (أسود قوي)
      secondary: '#4B5563',    // نص ثانوي
      tertiary: '#6B7280',     // نص ثالث
      disabled: '#9CA3AF',     // نص معطل
      inverse: '#FFFFFF',      // نص معكوس (على خلفية داكنة)
    },
    
    // الحدود
    border: {
      default: '#E5E7EB',      // حدود افتراضية
      hover: '#D1D5DB',        // عند التحويم
      focus: '#3B82F6',        // عند التركيز
      error: '#EF4444',        // حدود خطأ
    },
    
    // الظلال
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    }
  },

  // ═══════════════════════════════════════════
  // Dark Mode (الوضع الليلي)
  // ═══════════════════════════════════════════
  dark: {
    // الخلفيات
    background: {
      primary: '#0F172A',      // خلفية رئيسية (أسود مزرق)
      secondary: '#1E293B',    // خلفية ثانوية
      tertiary: '#334155',     // خلفية ثالثة
      hover: '#334155',        // عند التحويم
      selected: '#475569',     // عند التحديد
    },
    
    // النصوص
    text: {
      primary: '#F8FAFC',      // نص أساسي (أبيض ناصع)
      secondary: '#CBD5E1',    // نص ثانوي
      tertiary: '#94A3B8',     // نص ثالث
      disabled: '#64748B',     // نص معطل
      inverse: '#0F172A',      // نص معكوس (على خلفية فاتحة)
    },
    
    // الحدود
    border: {
      default: '#334155',      // حدود افتراضية
      hover: '#475569',        // عند التحويم
      focus: '#60A5FA',        // عند التركيز
      error: '#F87171',        // حدود خطأ
    },
    
    // الظلال
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
    }
  },

  // ═══════════════════════════════════════════
  // UX Colors (ألوان تجربة المستخدم)
  // ═══════════════════════════════════════════
  ux: {
    // النجاح (Success)
    success: {
      light: '#D1FAE5',        // خلفية فاتحة
      default: '#10B981',      // اللون الأساسي
      dark: '#065F46',         // لون داكن
      text: '#047857',         // لون النص
    },
    
    // الخطأ (Error)
    error: {
      light: '#FEE2E2',        // خلفية فاتحة
      default: '#EF4444',      // اللون الأساسي
      dark: '#991B1B',         // لون داكن
      text: '#DC2626',         // لون النص
    },
    
    // التحذير (Warning)
    warning: {
      light: '#FEF3C7',        // خلفية فاتحة
      default: '#F59E0B',      // اللون الأساسي
      dark: '#92400E',         // لون داكن
      text: '#D97706',         // لون النص
    },
    
    // المعلومات (Info)
    info: {
      light: '#DBEAFE',        // خلفية فاتحة
      default: '#3B82F6',      // اللون الأساسي
      dark: '#1E40AF',         // لون داكن
      text: '#2563EB',         // لون النص
    },
  },

  // ═══════════════════════════════════════════
  // Interactive States (الحالات التفاعلية)
  // ═══════════════════════════════════════════
  interactive: {
    primary: {
      default: '#3B82F6',      // الحالة الافتراضية
      hover: '#2563EB',        // عند التحويم
      active: '#1D4ED8',       // عند الضغط
      disabled: '#93C5FD',     // معطل
      focus: '#60A5FA',        // عند التركيز
    },
    
    secondary: {
      default: '#8B5CF6',      // بنفسجي
      hover: '#7C3AED',
      active: '#6D28D9',
      disabled: '#C4B5FD',
      focus: '#A78BFA',
    },
    
    accent: {
      default: '#10B981',      // أخضر
      hover: '#059669',
      active: '#047857',
      disabled: '#6EE7B7',
      focus: '#34D399',
    }
  },
};

// ═══════════════════════════════════════════
// Theme Switcher (محول السمات)
// ═══════════════════════════════════════════

export class ThemeManager {
  private currentTheme: 'light' | 'dark' = 'light';
  
  // التبديل بين Light & Dark
  toggle() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.apply();
  }
  
  // تطبيق السمة
  private apply() {
    const colors = COLOR_SYSTEM[this.currentTheme];
    
    // تطبيق CSS Variables
    document.documentElement.style.setProperty(
      '--bg-primary', colors.background.primary
    );
    document.documentElement.style.setProperty(
      '--text-primary', colors.text.primary
    );
    // ... apply all colors
    
    // إضافة class للـ body
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(this.currentTheme);
    
    // حفظ التفضيل
    localStorage.setItem('theme', this.currentTheme);
  }
  
  // الكشف التلقائي عن تفضيلات النظام
  detectSystemPreference() {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    
    this.currentTheme = prefersDark ? 'dark' : 'light';
    this.apply();
  }
  
  // تحميل التفضيل المحفوظ
  loadSavedPreference() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) {
      this.currentTheme = saved;
      this.apply();
    } else {
      this.detectSystemPreference();
    }
  }
}
```

#### 🎯 مبادئ استخدام الألوان

**1. الوضوح والتباين**
- WCAG AA Compliance
- نص عادي: ≥ 4.5:1
- نص كبير: ≥ 3:1
- عناصر تفاعلية: ≥ 3:1

**2. التسلسل الهرمي**
- الأسود/الأبيض للعناصر الرئيسية
- الرمادي للعناصر الثانوية
- الألوان الزاهية للتأكيدات فقط

**3. الدلالة اللونية**
- ✅ أخضر - للنجاح والإكمال
- ❌ أحمر - للأخطاء والتحذيرات الحرجة
- ⚠️ برتقالي - للتنبيهات
- ℹ️ أزرق - للمعلومات

**4. الاتساق**
- استخدم نفس اللون لنفس الغرض في كل مكان
- الأزرق الأساسي دائماً للروابط
- الأخضر دائماً للنجاح
- الأحمر دائماً للخطأ

**5. إمكانية الوصول (Accessibility)**
- دعم color blindness
- استخدام أنماط وأيقونات مع الألوان
- Dark Mode support
- تحويل سلس (0.3s ease)

#### 🔄 تطبيق Dark Mode

```typescript
// في Next.js:
import { ThemeProvider } from 'next-themes';

function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"  // تلقائي من النظام
      enableSystem={true}
      themes={['light', 'dark']}
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

// Theme Toggle Button:
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
```

#### 📊 مصفوفة استخدام الألوان

```
┌─────────────────────────────────────────────────────────┐
│  العنصر           │  Light Mode     │  Dark Mode       │
├─────────────────────────────────────────────────────────┤
│  الخلفية الرئيسية  │  #FFFFFF        │  #0F172A        │
│  الخلفية الثانوية  │  #F9FAFB        │  #1E293B        │
│  النص الأساسي      │  #111827        │  #F8FAFC        │
│  النص الثانوي      │  #4B5563        │  #CBD5E1        │
│  الحدود           │  #E5E7EB        │  #334155        │
│  الرابط           │  #3B82F6        │  #60A5FA        │
│  النجاح           │  #10B981        │  #10B981        │
│  الخطأ            │  #EF4444        │  #F87171        │
│  التحذير          │  #F59E0B        │  #F59E0B        │
│  المعلومات        │  #3B82F6        │  #60A5FA        │
└─────────────────────────────────────────────────────────┘
```

---

**🎉 مستعدون للبناء!**
