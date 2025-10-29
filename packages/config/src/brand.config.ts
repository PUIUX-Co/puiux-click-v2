/**
 * Brand Configuration
 *
 * Single source of truth for all branding-related settings.
 * Change these values to rebrand the entire platform.
 */

export const brandConfig = {
  // Company Info
  company: {
    name: 'PUIUX',
    fullName: 'PUIUX Co.',
    website: 'https://puiux.com',
  },

  // Product Info
  product: {
    name: 'PUIUX Click',
    tagline: {
      en: 'Build professional websites in minutes',
      ar: 'بناء مواقع احترافية في دقائق',
    },
    description: {
      en: 'Build professional, multi-lingual websites in 2-5 minutes using AI-powered builders',
      ar: 'بناء مواقع احترافية متعددة اللغات في 2-5 دقائق باستخدام الذكاء الاصطناعي',
    },
    version: '2.0.0',
  },

  // URLs
  urls: {
    app: process.env.NEXT_PUBLIC_APP_URL || 'https://puiuxclick.com',
    api: process.env.NEXT_PUBLIC_API_URL || 'https://api.puiuxclick.com',
    docs: 'https://docs.puiuxclick.com',
    support: 'https://support.puiuxclick.com',
    status: 'https://status.puiuxclick.com',
  },

  // Contact
  contact: {
    email: 'support@puiuxclick.com',
    phone: '+966XXXXXXXXX', // TODO: Add real phone number
    whatsapp: '+966XXXXXXXXX', // TODO: Add real WhatsApp number
    address: {
      ar: 'الرياض، المملكة العربية السعودية',
      en: 'Riyadh, Saudi Arabia',
    },
  },

  // Social Media
  social: {
    twitter: '@puiux',
    facebook: 'puiux',
    instagram: 'puiux',
    linkedin: 'company/puiux',
    github: 'PUIUX-Co',
  },

  // Colors (Tailwind classes)
  colors: {
    primary: 'hsl(221.2 83.2% 53.3%)', // Blue
    secondary: 'hsl(210 40% 96.1%)', // Light gray
    accent: 'hsl(210 40% 96.1%)',
    destructive: 'hsl(0 84.2% 60.2%)', // Red
    success: 'hsl(142 76% 36%)', // Green
    warning: 'hsl(38 92% 50%)', // Orange
    info: 'hsl(199 89% 48%)', // Light blue
  },

  // Logo
  logo: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
    icon: '/logo-icon.svg',
    favicon: '/favicon.ico',
  },

  // Features
  features: {
    buildTime: {
      min: 2,
      max: 5,
      unit: 'minutes',
    },
    industries: [
      {
        id: 'restaurant',
        name: { ar: 'مطعم', en: 'Restaurant' },
        icon: '🍽️',
      },
      {
        id: 'dental',
        name: { ar: 'عيادة أسنان', en: 'Dental Clinic' },
        icon: '🦷',
      },
      {
        id: 'portfolio',
        name: { ar: 'معرض أعمال', en: 'Portfolio' },
        icon: '💼',
      },
      {
        id: 'business',
        name: { ar: 'خدمات تجارية', en: 'Business Services' },
        icon: '🏢',
      },
      {
        id: 'store',
        name: { ar: 'متجر إلكتروني', en: 'Online Store' },
        icon: '🛒',
      },
    ],
    templates: {
      total: 5,
      perIndustry: 3,
    },
  },

  // Plans (Phase 1: Free only)
  plans: {
    free: {
      name: 'Free',
      price: 0,
      currency: 'SAR',
      features: {
        sites: 1,
        storage: 100, // MB
        bandwidth: 1000, // MB
        customDomain: false,
        aiGeneration: false,
        analytics: 'basic',
        support: 'community',
      },
    },
    // Phase 2: Add paid plans
    // starter: { ... },
    // pro: { ... },
    // business: { ... },
  },

  // Legal
  legal: {
    companyName: 'PUIUX Co.',
    registrationNumber: 'XXXXXXXXX', // TODO: Add real registration number
    taxNumber: 'XXXXXXXXX', // TODO: Add real VAT number
    termsUrl: '/terms',
    privacyUrl: '/privacy',
    cookieUrl: '/cookies',
  },

  // Analytics (Phase 2)
  analytics: {
    google: process.env.NEXT_PUBLIC_GA_ID || '',
    hotjar: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
  },

  // Localization
  localization: {
    defaultLocale: 'ar',
    supportedLocales: ['ar', 'en'],
    rtlLocales: ['ar'],
  },
} as const;

export type BrandConfig = typeof brandConfig;
