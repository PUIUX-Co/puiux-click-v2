export type MessageRole = 'user' | 'ai' | 'system';
export type ConversationStep =
  | 'welcome'
  | 'industry'
  | 'businessName'
  | 'description'
  | 'contact'
  | 'colors'
  | 'generating'
  | 'complete';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  step?: ConversationStep;
}

export interface ConversationData {
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

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  preview: string;
}

export const industries = [
  { id: 'RESTAURANT', name: 'مطعم', icon: '🍽️', keywords: ['مطعم', 'restaurant', 'food', 'طعام'] },
  { id: 'DENTAL', name: 'عيادة أسنان', icon: '🦷', keywords: ['أسنان', 'dental', 'عيادة', 'clinic'] },
  { id: 'PORTFOLIO', name: 'معرض أعمال', icon: '💼', keywords: ['portfolio', 'معرض', 'أعمال', 'تصميم'] },
  { id: 'BUSINESS', name: 'شركة', icon: '🏢', keywords: ['شركة', 'business', 'company'] },
  { id: 'STORE', name: 'متجر', icon: '🛍️', keywords: ['متجر', 'store', 'shop', 'محل'] },
];

export const colorSchemes: ColorScheme[] = [
  {
    id: 'ocean',
    name: 'أزرق المحيط',
    primary: '#0ea5e9',
    secondary: '#0284c7',
    accent: '#06b6d4',
    preview: 'من-الأزرق-للفيروزي',
  },
  {
    id: 'sunset',
    name: 'غروب الشمس',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c',
    preview: 'من-البرتقالي-للوردي',
  },
  {
    id: 'forest',
    name: 'غابة خضراء',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    preview: 'من-الأخضر-للزمردي',
  },
  {
    id: 'royal',
    name: 'أرجواني ملكي',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    preview: 'من-البنفسجي-للوردي',
  },
  {
    id: 'elegant',
    name: 'رمادي أنيق',
    primary: '#64748b',
    secondary: '#475569',
    accent: '#94a3b8',
    preview: 'من-الرمادي-للأزرق',
  },
];
