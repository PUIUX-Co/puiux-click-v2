export type IndustryType = 'RESTAURANT' | 'DENTAL' | 'PORTFOLIO' | 'BUSINESS' | 'STORE';

export interface WizardData {
  // Step 1: Industry
  industry: IndustryType | null;

  // Step 2: Business Info
  businessName: string;
  description: string;
  phone: string;
  email: string;
  address: string;

  // Step 3: Color Palette
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };

  // Step 3.5: Selected Sections (NEW)
  selectedSections: string[];

  // Step 4: Template
  templateId: string;
}

export interface WizardContextType {
  // Current step (0-4)
  currentStep: number;

  // Wizard data
  data: WizardData;

  // Methods
  setIndustry: (industry: IndustryType) => void;
  setBusinessInfo: (info: Partial<WizardData>) => void;
  setColorPalette: (colors: WizardData['colorPalette']) => void;
  setSelectedSections: (sections: string[]) => void;
  setTemplate: (templateId: string) => void;

  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Validation
  canProceed: boolean;

  // Submit
  generateSite: () => Promise<void>;
  loading: boolean;
}

export const industries = [
  {
    id: 'RESTAURANT',
    name: {
      ar: 'مطعم',
      en: 'Restaurant',
    },
    icon: '🍽️',
    description: 'قوالب مخصصة للمطاعم والكافيهات',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'DENTAL',
    name: {
      ar: 'عيادة أسنان',
      en: 'Dental Clinic',
    },
    icon: '🦷',
    description: 'قوالب احترافية للعيادات الطبية',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'PORTFOLIO',
    name: {
      ar: 'معرض أعمال',
      en: 'Portfolio',
    },
    icon: '🎨',
    description: 'اعرض أعمالك بشكل احترافي',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'BUSINESS',
    name: {
      ar: 'نشاط تجاري',
      en: 'Business',
    },
    icon: '💼',
    description: 'قوالب للشركات والخدمات',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'STORE',
    name: {
      ar: 'متجر إلكتروني',
      en: 'Online Store',
    },
    icon: '🛍️',
    description: 'ابدأ متجرك الإلكتروني الآن',
    color: 'from-yellow-500 to-orange-500',
  },
] as const;

// Available sections for each industry
export const availableSections: Record<IndustryType, Array<{ id: string; title: string; description: string; required: boolean }>> = {
  RESTAURANT: [
    { id: 'hero', title: 'القسم الرئيسي', description: 'صورة رئيسية وعنوان جذاب', required: true },
    { id: 'about', title: 'من نحن', description: 'نبذة عن المطعم', required: true },
    { id: 'menu', title: 'قائمة الطعام', description: 'أصناف الطعام والمشروبات', required: false },
    { id: 'gallery', title: 'معرض الصور', description: 'صور من المطعم والأطباق', required: false },
    { id: 'testimonials', title: 'آراء العملاء', description: 'تقييمات ومراجعات الزوار', required: false },
    { id: 'contact', title: 'تواصل معنا', description: 'معلومات الاتصال والموقع', required: true },
  ],
  DENTAL: [
    { id: 'hero', title: 'القسم الرئيسي', description: 'صورة رئيسية ومعلومات العيادة', required: true },
    { id: 'about', title: 'من نحن', description: 'نبذة عن العيادة', required: true },
    { id: 'services', title: 'الخدمات', description: 'خدمات الأسنان المتوفرة', required: false },
    { id: 'team', title: 'فريق العمل', description: 'الأطباء والممرضين', required: false },
    { id: 'testimonials', title: 'آراء المرضى', description: 'تقييمات المرضى', required: false },
    { id: 'contact', title: 'احجز موعد', description: 'نموذج حجز ومعلومات التواصل', required: true },
  ],
  PORTFOLIO: [
    { id: 'hero', title: 'القسم الرئيسي', description: 'عنوان ترحيبي', required: true },
    { id: 'about', title: 'من أنا', description: 'نبذة تعريفية', required: true },
    { id: 'portfolio', title: 'أعمالي', description: 'معرض الأعمال والمشاريع', required: false },
    { id: 'services', title: 'الخدمات', description: 'الخدمات التي تقدمها', required: false },
    { id: 'testimonials', title: 'آراء العملاء', description: 'تقييمات العملاء', required: false },
    { id: 'contact', title: 'تواصل معي', description: 'نموذج تواصل ومعلومات', required: true },
  ],
  BUSINESS: [
    { id: 'hero', title: 'القسم الرئيسي', description: 'عنوان الشركة الرئيسي', required: true },
    { id: 'about', title: 'من نحن', description: 'نبذة عن الشركة', required: true },
    { id: 'services', title: 'خدماتنا', description: 'الخدمات التي نقدمها', required: false },
    { id: 'features', title: 'مميزاتنا', description: 'ما يميزنا عن المنافسين', required: false },
    { id: 'team', title: 'فريق العمل', description: 'أعضاء الفريق', required: false },
    { id: 'contact', title: 'تواصل معنا', description: 'نموذج تواصل ومعلومات', required: true },
  ],
  STORE: [
    { id: 'hero', title: 'القسم الرئيسي', description: 'عنوان المتجر الرئيسي', required: true },
    { id: 'about', title: 'من نحن', description: 'نبذة عن المتجر', required: true },
    { id: 'products', title: 'المنتجات', description: 'عرض المنتجات', required: false },
    { id: 'categories', title: 'التصنيفات', description: 'تصنيفات المنتجات', required: false },
    { id: 'testimonials', title: 'آراء العملاء', description: 'تقييمات المشترين', required: false },
    { id: 'contact', title: 'تواصل معنا', description: 'معلومات التواصل', required: true },
  ],
};

export const defaultColorPalettes = [
  {
    name: 'Ocean Blue',
    primary: '#0ea5e9',
    secondary: '#0284c7',
    accent: '#06b6d4',
  },
  {
    name: 'Forest Green',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#14b8a6',
  },
  {
    name: 'Sunset Orange',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c',
  },
  {
    name: 'Royal Purple',
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#c084fc',
  },
  {
    name: 'Cherry Red',
    primary: '#ef4444',
    secondary: '#dc2626',
    accent: '#f87171',
  },
  {
    name: 'Modern Dark',
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#818cf8',
  },
];
