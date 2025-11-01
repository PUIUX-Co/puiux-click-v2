'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Copy,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
  Wand2,
  MessageSquare,
  Heading1,
  AlignLeft,
  List,
  Package,
  Phone,
  Star,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateText, ContentType, generateSection, SectionType, type GeneratedSection } from '@/lib/api/ai';

/**
 * AI Content Generator Panel
 * Floating panel in the Editor for AI-powered content generation
 */

interface AIContentGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  siteData?: {
    businessName: string;
    industry: string;
    description?: string;
    colorPalette?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
  };
}

type Tone = 'professional' | 'friendly' | 'formal' | 'casual';

interface ContentOption {
  type: ContentType;
  label: string;
  icon: any;
  placeholder: string;
}

const contentTypes: ContentOption[] = [
  {
    type: ContentType.HERO_TITLE,
    label: 'عنوان رئيسي (Hero)',
    icon: Heading1,
    placeholder: 'مثال: مطعم فاخر متخصص في المأكولات الإيطالية',
  },
  {
    type: ContentType.HERO_SUBTITLE,
    label: 'عنوان فرعي (Hero)',
    icon: AlignLeft,
    placeholder: 'مثال: نقدم أشهى الأطباق الإيطالية الأصيلة',
  },
  {
    type: ContentType.ABOUT_SECTION,
    label: 'قسم "عنا"',
    icon: MessageSquare,
    placeholder: 'مثال: مطعم تأسس عام 2020 بخبرة 20 سنة',
  },
  {
    type: ContentType.SERVICE_DESCRIPTION,
    label: 'وصف الخدمات',
    icon: List,
    placeholder: 'مثال: خدمات تصميم مواقع احترافية',
  },
  {
    type: ContentType.PRODUCT_DESCRIPTION,
    label: 'وصف المنتجات',
    icon: Package,
    placeholder: 'مثال: منتجات عضوية طبيعية 100%',
  },
  {
    type: ContentType.CTA_TEXT,
    label: 'دعوة لاتخاذ إجراء (CTA)',
    icon: Phone,
    placeholder: 'مثال: احجز الآن واحصل على خصم 20%',
  },
  {
    type: ContentType.TESTIMONIAL,
    label: 'شهادات العملاء',
    icon: Star,
    placeholder: 'مثال: عميل راضي عن جودة الخدمة',
  },
  {
    type: ContentType.BLOG_POST,
    label: 'مقال / نص طويل',
    icon: FileText,
    placeholder: 'مثال: مقال عن فوائد منتجاتنا',
  },
];

const toneOptions: { value: Tone; label: string; emoji: string }[] = [
  { value: 'professional', label: 'احترافي', emoji: '💼' },
  { value: 'friendly', label: 'ودي', emoji: '😊' },
  { value: 'formal', label: 'رسمي', emoji: '🎩' },
  { value: 'casual', label: 'عادي', emoji: '👋' },
];

export default function AIContentGenerator({
  isOpen,
  onClose,
  siteData,
}: AIContentGeneratorProps) {
  const [selectedType, setSelectedType] = useState<ContentType>(ContentType.HERO_TITLE);
  const [selectedTone, setSelectedTone] = useState<Tone>('professional');
  const [context, setContext] = useState('');
  const [maxLength, setMaxLength] = useState(100);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedSection, setGeneratedSection] = useState<GeneratedSection | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const selectedOption = contentTypes.find((ct) => ct.type === selectedType)!;

  // Check if this content type should generate a full section
  const shouldGenerateSection = selectedType === ContentType.ABOUT_SECTION;

  // Map ContentType to SectionType for section generation
  const getSectionType = (contentType: ContentType): SectionType | null => {
    const mapping: Record<ContentType, SectionType | null> = {
      [ContentType.ABOUT_SECTION]: SectionType.ABOUT,
      [ContentType.HERO_TITLE]: SectionType.HERO,
      [ContentType.HERO_SUBTITLE]: null,
      [ContentType.SERVICE_DESCRIPTION]: SectionType.SERVICES,
      [ContentType.PRODUCT_DESCRIPTION]: SectionType.PRODUCTS,
      [ContentType.TESTIMONIAL]: SectionType.TESTIMONIALS,
      [ContentType.CTA_TEXT]: null,
      [ContentType.BLOG_POST]: null,
      [ContentType.CUSTOM]: null,
    };
    return mapping[contentType] || null;
  };

  const handleInsertSection = (section: GeneratedSection) => {
    const editor = (window as any).grapesEditorInstance;
    if (!editor) {
      toast.error('المحرر غير متاح');
      return;
    }

    try {
      console.log('Adding section to GrapesJS editor:', section);
      
      // Get the wrapper component (main page container)
      const wrapper = editor.getWrapper();
      if (!wrapper) {
        toast.error('لا يمكن العثور على المحتوى الرئيسي');
        return;
      }

      console.log('Wrapper found, adding section HTML:', section.html.substring(0, 100));

      // Add CSS styles if available
      if (section.css && section.css.trim()) {
        // Add CSS to GrapesJS styles
        const styles = editor.getStyle();
        const newStyle = {
          selectors: [],
          style: section.css,
          mediaText: '',
          atRuleType: '',
        };
        styles.push(newStyle);
        editor.setStyle(styles);

        // Also add to canvas document head for preview
        const canvasDoc = editor.Canvas.getDocument();
        if (canvasDoc) {
          let styleElement = canvasDoc.getElementById('generated-section-styles');
          if (!styleElement) {
            styleElement = canvasDoc.createElement('style');
            styleElement.id = 'generated-section-styles';
            canvasDoc.head.appendChild(styleElement);
          }
          // Append new CSS instead of replacing
          const existingCSS = styleElement.innerHTML || '';
          styleElement.innerHTML = existingCSS + '\n' + section.css;
        }
      }

      // Add HTML section to the page using GrapesJS
      // Try multiple methods to ensure it works
      let addedComponents = null;
      
      // Method 1: Use addComponents with wrapper as parent
      try {
        addedComponents = editor.addComponents(section.html, {
          at: wrapper,
        });
        console.log('Method 1 (addComponents with wrapper):', addedComponents);
      } catch (error1) {
        console.warn('Method 1 failed:', error1);
        try {
          // Method 2: Use DomComponents.addComponents directly
          addedComponents = editor.DomComponents.addComponents(section.html, {
            at: wrapper,
          });
          console.log('Method 2 (DomComponents.addComponents with wrapper):', addedComponents);
        } catch (error2) {
          console.warn('Method 2 failed:', error2);
          try {
            // Method 3: Use wrapper.append directly
            wrapper.append(section.html);
            console.log('Method 3 (wrapper.append): Success');
          } catch (error3) {
            console.warn('Method 3 failed:', error3);
            // Method 4: Use addComponents without at option (adds to root)
            try {
              addedComponents = editor.addComponents(section.html);
              console.log('Method 4 (addComponents without at):', addedComponents);
              // Then move to wrapper if needed
              if (addedComponents && addedComponents.length > 0) {
                wrapper.append(addedComponents);
              }
            } catch (error4) {
              console.error('All methods failed:', error4);
              throw new Error('فشل في إضافة القسم بجميع الطرق');
            }
          }
        }
      }

      // Ensure the editor updates to show the new components
      // Refresh the canvas to render the new section
      editor.refresh();

      // Trigger component update events to ensure auto-save works
      editor.trigger('component:update');
      editor.trigger('change');
      editor.trigger('update'); // This triggers auto-save

      // Force save after adding section to ensure it's persisted
      setTimeout(() => {
        try {
          const pagesData = editor.getProjectData();
          // Trigger save through the window event system if available
          const saveEvent = new CustomEvent('grapesjs:save', { detail: pagesData });
          window.dispatchEvent(saveEvent);
          
          // Also trigger the editor's update event manually
          if (editor.trigger && typeof editor.trigger === 'function') {
            editor.trigger('update');
          }
        } catch (saveError) {
          console.warn('Failed to trigger save:', saveError);
        }
      }, 500);

      // Select the newly added component to make it visible (if available)
      if (addedComponents && addedComponents.length > 0) {
        // Wait a bit for the component to be rendered
        setTimeout(() => {
          try {
            editor.select(addedComponents[0]);
          } catch (selectError) {
            console.warn('Failed to select component:', selectError);
          }
        }, 200);
      } else {
        // If no component was returned, try to find it manually
        setTimeout(() => {
          const wrapperComponents = wrapper.components();
          if (wrapperComponents && wrapperComponents.length > 0) {
            const lastComponent = wrapperComponents[wrapperComponents.length - 1];
            try {
              editor.select(lastComponent);
            } catch (selectError) {
              console.warn('Failed to select last component:', selectError);
            }
          }
        }, 200);
      }

      toast.success('تم إضافة القسم إلى الصفحة بنجاح! ✅');
      
      // Close panel after a short delay
      setTimeout(() => {
        onClose();
        // Reset form
        setGeneratedSection(null);
        setContext('');
      }, 1500);
    } catch (error: any) {
      console.error('Failed to insert section:', error);
      console.error('Error details:', error.message, error.stack);
      toast.error(`فشل في إضافة القسم: ${error.message || 'يرجى المحاولة مرة أخرى'}`);
    }
  };

  const handleGenerate = async () => {
    if (!context.trim()) {
      toast.error('من فضلك اكتب سياق مختصر أولاً');
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedContent('');
      setGeneratedSection(null);

      // Build context with site data
      let fullContext = context;
      if (siteData) {
        fullContext = `النشاط: ${siteData.businessName} (${siteData.industry}).\n`;
        if (siteData.description) {
          fullContext += `الوصف: ${siteData.description}.\n`;
        }
        fullContext += `السياق: ${context}`;
      }

      // If this should be a full section, generate section instead
      if (shouldGenerateSection) {
        const sectionType = getSectionType(selectedType);
        if (sectionType) {
          const result = await generateSection({
            sectionType,
            context: fullContext,
            businessName: siteData?.businessName,
            industry: siteData?.industry,
            description: siteData?.description || fullContext,
            colorPalette: siteData?.colorPalette,
            language: 'ar',
          });

          setGeneratedSection(result);
          toast.success('تم توليد القسم بنجاح! ✨');
          
          // Automatically add section to editor
          handleInsertSection(result);
        }
      } else {
        // Generate text content
        const result = await generateText({
          contentType: selectedType,
          context: fullContext,
          tone: selectedTone,
          maxLength,
        });

        setGeneratedContent(result.content);
        toast.success('تم توليد المحتوى بنجاح! ✨');
      }
    } catch (error: any) {
      console.error('Failed to generate content:', error);
      toast.error(error.response?.data?.message || 'فشل في توليد المحتوى');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedContent) return;

    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      toast.success('تم النسخ! 📋');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('فشل النسخ');
    }
  };

  const handleInsert = () => {
    if (!generatedContent) return;

    // Try to insert into GrapesJS editor
    const editor = (window as any).grapesEditorInstance;
    if (editor) {
      const selected = editor.getSelected();
      if (selected && selected.is('text')) {
        selected.components(generatedContent);
        toast.success('تم الإدراج في العنصر المحدد! ✅');
        onClose();
      } else {
        toast('اختر عنصر نصي في الـ Editor أولاً، أو انسخ المحتوى', {
          icon: 'ℹ️',
        });
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 bg-gradient-to-br from-purple-50 to-blue-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
                  <Wand2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    مولد المحتوى بالذكاء الاصطناعي
                  </h2>
                  <p className="text-xs text-gray-600">
                    اكتب سياق مختصر واحصل على محتوى احترافي
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Content Type Selection */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    نوع المحتوى
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {contentTypes.map((option) => {
                      const OptionIcon = option.icon;
                      return (
                        <button
                          key={option.type}
                          onClick={() => setSelectedType(option.type)}
                          className={`flex items-center gap-2 rounded-lg border-2 p-3 text-right transition-all ${
                            selectedType === option.type
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <OptionIcon className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tone Selection */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    أسلوب الكتابة
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {toneOptions.map((tone) => (
                      <button
                        key={tone.value}
                        onClick={() => setSelectedTone(tone.value)}
                        className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                          selectedTone === tone.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl">{tone.emoji}</span>
                        <span className="text-sm font-medium">{tone.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Context Input */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    السياق
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder={selectedOption.placeholder}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    اكتب وصف مختصر أو معلومات إضافية لتوليد محتوى أفضل
                  </p>
                </div>

                {/* Advanced Options */}
                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    {showAdvanced ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    إعدادات متقدمة
                  </button>

                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 overflow-hidden"
                      >
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          الحد الأقصى للطول: {maxLength} كلمة
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="300"
                          step="25"
                          value={maxLength}
                          onChange={(e) => setMaxLength(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>قصير (50)</span>
                          <span>طويل (300)</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !context.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>جاري التوليد...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>توليد المحتوى</span>
                    </>
                  )}
                </button>

                {/* Generated Content */}
                <AnimatePresence>
                  {generatedSection && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4"
                    >
                      <div className="flex items-center gap-2 text-green-700">
                        <Sparkles className="h-5 w-5" />
                        <span className="font-semibold">تم توليد القسم بنجاح!</span>
                      </div>
                      <div className="rounded-lg bg-white p-4 text-right text-sm leading-relaxed text-gray-800">
                        <p>تم إضافة القسم إلى صفحتك بنجاح. يمكنك الآن تعديله في المحرر.</p>
                      </div>
                    </motion.div>
                  )}
                  {generatedContent && !generatedSection && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4"
                    >
                      <div className="flex items-center gap-2 text-green-700">
                        <Sparkles className="h-5 w-5" />
                        <span className="font-semibold">المحتوى المولد</span>
                      </div>
                      <div className="rounded-lg bg-white p-4 text-right leading-relaxed text-gray-800">
                        {generatedContent}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-50"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span>تم النسخ!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span>نسخ</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleInsert}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
                        >
                          <Wand2 className="h-4 w-4" />
                          <span>إدراج</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer Tips */}
            <div className="border-t border-border/50 bg-gray-50 px-6 py-4">
              <div className="flex items-start gap-3 text-xs text-gray-600">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                <div className="space-y-1">
                  <p className="font-medium text-gray-700">💡 نصائح للحصول على أفضل نتيجة:</p>
                  <ul className="list-inside list-disc space-y-0.5 text-right">
                    <li>كن محددًا في وصف السياق</li>
                    <li>اذكر معلومات مميزة عن نشاطك</li>
                    <li>جرب أساليب كتابة مختلفة</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
