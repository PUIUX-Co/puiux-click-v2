/**
 * Voice Builder Types
 *
 * Full support for Arabic dialects with natural language processing
 */

export type VoiceDialect = 'saudi-najdi' | 'egyptian' | 'standard';
export type RecordingStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  transcript: string; // النص المكتوب
  audioUrl?: string; // رابط الصوت المسجل (للمستخدم)
  timestamp: Date;
  dialect?: VoiceDialect;
  confidence?: number; // ثقة التعرف على الصوت (0-1)
}

export interface VoiceConversationData {
  industry: string | null;
  businessName: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface ExtractedKeywords {
  industry?: string[];
  businessName?: string;
  description?: string[];
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  colors?: string[];
  mixed?: string[]; // مصطلحات مختلطة (عربي + إنجليزي)
}

// اللهجات المدعومة
export const supportedDialects = {
  'saudi-najdi': {
    id: 'saudi-najdi',
    name: 'سعودية نجدية',
    icon: '🇸🇦',
    langCode: 'ar-SA',
    voiceGender: 'male' as const,
    greetings: ['يا هلا', 'حياك الله', 'أهلين', 'مرحبا فيك'],
    affirmatives: ['ايوه', 'صحيح', 'زين', 'تمام', 'ماشي'],
    encouragements: ['ماشاء الله', 'الله يبارك فيك', 'ممتاز', 'زين كذا'],
  },
  'egyptian': {
    id: 'egyptian',
    name: 'مصرية',
    icon: '🇪🇬',
    langCode: 'ar-EG',
    voiceGender: 'male' as const,
    greetings: ['أهلاً', 'ازيك', 'حبيبي', 'يا معلم'],
    affirmatives: ['آه', 'تمام', 'ماشي', 'حلو', 'كويس'],
    encouragements: ['برافو عليك', 'تحفة', 'ده جميل', 'عظمة'],
  },
  'standard': {
    id: 'standard',
    name: 'عربية فصحى',
    icon: '📖',
    langCode: 'ar',
    voiceGender: 'male' as const,
    greetings: ['مرحباً', 'أهلاً وسهلاً', 'حياك الله'],
    affirmatives: ['نعم', 'صحيح', 'جيد', 'ممتاز'],
    encouragements: ['ممتاز', 'رائع', 'جيد جداً'],
  },
} as const;

// الكلمات المفتاحية للصناعات (بكل اللهجات)
export const industryKeywords = {
  RESTAURANT: [
    // عربي
    'مطعم', 'أكل', 'طعام', 'مأكولات', 'وجبات', 'كافيه', 'كافتيريا', 'بوفيه',
    // سعودي
    'مطعمي', 'محلي', 'منيو', 'أكلات',
    // مصري
    'أكلات', 'فول', 'كشري', 'مطعمي',
    // إنجليزي مختلط
    'restaurant', 'cafe', 'food', 'menu', 'buffet',
  ],
  DENTAL: [
    'أسنان', 'طبيب', 'عيادة', 'دكتور', 'اسنان', 'طب', 'علاج',
    'عيادتي', 'دكتوري', 'طبيبي',
    'dental', 'clinic', 'doctor', 'teeth',
  ],
  PORTFOLIO: [
    'معرض', 'أعمال', 'شغل', 'مشاريع', 'بورتفوليو', 'سيرة', 'CV',
    'شغلي', 'أعمالي', 'مشاريعي',
    'portfolio', 'work', 'projects', 'cv', 'resume',
  ],
  BUSINESS: [
    'شركة', 'أعمال', 'خدمات', 'تجاري', 'مؤسسة', 'بزنس',
    'شركتي', 'خدماتي', 'مؤسستي',
    'business', 'services', 'company', 'corporate',
  ],
  STORE: [
    'متجر', 'محل', 'دكان', 'بيع', 'تسوق', 'سوق', 'ستور',
    'محلي', 'متجري', 'دكاني',
    'store', 'shop', 'market', 'shopping', 'ecommerce',
  ],
} as const;

// كلمات التواصل
export const contactKeywords = {
  phone: [
    'رقم', 'هاتف', 'جوال', 'موبايل', 'تلفون', 'رقمي',
    'phone', 'mobile', 'number', 'tel', 'call', 'whatsapp',
  ],
  email: [
    'إيميل', 'بريد', 'ايميل', 'بريدي', 'إلكتروني',
    'email', 'mail', 'gmail', '@',
  ],
  address: [
    'عنوان', 'موقع', 'مكان', 'منطقة', 'حي', 'شارع',
    'address', 'location', 'place',
  ],
} as const;

// كلمات الألوان
export const colorKeywords = {
  blue: ['أزرق', 'ازرق', 'سماوي', 'كحلي', 'blue', 'navy'],
  red: ['أحمر', 'احمر', 'قرمزي', 'red', 'crimson'],
  green: ['أخضر', 'اخضر', 'أخضري', 'green'],
  purple: ['بنفسجي', 'بنفسج', 'موف', 'purple', 'violet'],
  orange: ['برتقالي', 'برتقاني', 'orange'],
  yellow: ['أصفر', 'اصفر', 'ذهبي', 'yellow', 'gold'],
  pink: ['وردي', 'روز', 'pink', 'rose'],
  black: ['أسود', 'اسود', 'black'],
  white: ['أبيض', 'ابيض', 'white'],
} as const;

// مصطلحات تقنية شائعة (مختلطة)
export const technicalTerms = {
  responsive: ['responsive', 'ريسبونسيف', 'متجاوب', 'يشتغل على الجوال'],
  modern: ['modern', 'حديث', 'عصري', 'مودرن'],
  professional: ['professional', 'احترافي', 'بروفيشنال'],
  fast: ['fast', 'سريع', 'سرعة'],
  simple: ['simple', 'بسيط', 'سهل'],
  elegant: ['elegant', 'أنيق', 'elegant'],
} as const;

// نماذج الردود بحسب اللهجة
export const dialectResponses = {
  'saudi-najdi': {
    welcome: 'يا هلا والله! أنا بيكسي، مساعدك الصوتي من PUIUX Click 🎤✨\n\nتكلم بكل راحة، وأنا أفهمك وأساعدك تسوي موقعك في دقايق!\n\nقول لي، وش نوع نشاطك؟',
    industryConfirm: (industry: string) => `ماشاء الله! ${industry} مجال زين ومطلوب 💫\n\nوش اسم ${industry}ك؟`,
    nameConfirm: (name: string) => `${name}؟ والله اسم حلو! 🌟\n\nحدثني عن نشاطك، وش اللي يميزك؟`,
    descriptionConfirm: 'تمام! كلام واضح ومفهوم 📝\n\nعطني رقم جوالك أو إيميلك عشان الزباين يتواصلون معك:',
    contactConfirm: 'زين كذا! ✅\n\nالحين نختار الألوان، تفضل أي نوع ألوان؟',
    colorConfirm: (color: string) => `${color}؟ اختيار موفق! 🎨\n\nخلني أسوي لك الموقع الحين...`,
    generating: 'تكفى انتظر شوي، موقعك صار جاهز بإذن الله! 🚀',
    success: 'ماشاء الله! موقعك جاهز! 🎉\n\nالله يوفقك يا رب!',
    error: 'عذراً، ما فهمت عليك زين، ممكن تعيد الكلام؟',
  },
  'egyptian': {
    welcome: 'أهلاً بيك يا معلم! أنا بيكسي من PUIUX Click 🎤✨\n\nاتكلم عادي جداً، وأنا هفهمك وأساعدك تعمل موقعك في دقايق!\n\nقولي، إيه نشاطك؟',
    industryConfirm: (industry: string) => `برافو عليك! ${industry} ده مجال حلو جداً 💫\n\nطيب إيه اسم ${industry}ك؟`,
    nameConfirm: (name: string) => `${name}؟ اسم تحفة والله! 🌟\n\nقولي بقى، إيه اللي بيميزك عن غيرك؟`,
    descriptionConfirm: 'تمام! كلام واضح وجميل 📝\n\nعايز رقمك أو إيميلك عشان الناس تقدر تتواصل معاك:',
    contactConfirm: 'كويس كده! ✅\n\nدلوقتي نختار الألوان، عايز إيه؟',
    colorConfirm: (color: string) => `${color}؟ اختيار روعة! 🎨\n\nاستنى كده شوية، هعملك الموقع...`,
    generating: 'استنى شوية، موقعك بيتعمل دلوقتي! 🚀',
    success: 'يا سلام! موقعك جاهز! 🎉\n\nربنا يوفقك يا رب!',
    error: 'معلش، مفهمتش عليك، ممكن تقول تاني؟',
  },
  'standard': {
    welcome: 'مرحباً بك! أنا بيكسي، مساعدك الصوتي من PUIUX Click 🎤✨\n\nتحدث بكل راحة، وأنا سأساعدك في إنشاء موقعك خلال دقائق!\n\nما هو نوع نشاطك؟',
    industryConfirm: (industry: string) => `ممتاز! ${industry} مجال رائع 💫\n\nما اسم ${industry}ك؟`,
    nameConfirm: (name: string) => `${name}؟ اسم جميل! 🌟\n\nأخبرني عن نشاطك، ما الذي يميزك؟`,
    descriptionConfirm: 'جيد! وصف واضح 📝\n\nأعطني رقم هاتفك أو بريدك الإلكتروني:',
    contactConfirm: 'ممتاز! ✅\n\nالآن لنختر الألوان، ما هي الألوان التي تفضلها؟',
    colorConfirm: (color: string) => `${color}؟ اختيار موفق! 🎨\n\nدعني أنشئ موقعك الآن...`,
    generating: 'يرجى الانتظار، موقعك جاري إنشاؤه! 🚀',
    success: 'رائع! موقعك جاهز! 🎉',
    error: 'عذراً، لم أفهم، هل يمكنك الإعادة؟',
  },
} as const;

export type DialectResponses = typeof dialectResponses;
export type SupportedDialects = typeof supportedDialects;
