'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

import ChatMessage from '@/components/chat/ChatMessage';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ChatInput from '@/components/chat/ChatInput';
import ProgressTracker from '@/components/chat/ProgressTracker';
import PixiAvatar from '@/components/chat/PixiAvatar';
import ConfettiEffect from '@/components/chat/ConfettiEffect';
import LivePreview from '@/components/chat/LivePreview';
import SuccessScreen from '@/components/chat/SuccessScreen';
import ChatFooter from '@/components/chat/ChatFooter';
import FloatingElements from '@/components/chat/FloatingElements';
import { useAuth } from '@/contexts/AuthContext';
import { createSite } from '@/lib/api/sites';
import Image from 'next/image';

import type {
  ChatMessage as ChatMessageType,
  ConversationStep,
  ConversationData,
} from '@/types/chat';
import { industries, colorSchemes } from '@/types/chat';

export default function ChatBuilderPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversationData, setConversationData] = useState<ConversationData>({
    industry: null,
    businessName: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    colorPalette: colorSchemes[0],
  });
  const [isCreating, setIsCreating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [createdSiteId, setCreatedSiteId] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/chat-builder');
    }
  }, [isAuthenticated, router]);

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Initialize conversation
  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      setTimeout(() => {
        sendAIMessage(
          `مرحباً ${user?.name || 'صديقي'}! 👋\n\nأنا بيكسي، مساعدك الذكي من PUIUX Click ✨\n\nسأساعدك في بناء موقع احترافي من خلال محادثة بسيطة وممتعة.\n\nالرحلة ستستغرق فقط 2-4 دقائق، وستحصل على موقع مذهل جاهز للنشر! 🚀\n\nهل أنت مستعد لبدء هذه المغامرة؟ 🎯`,
          'welcome',
          ['نعم، لنبدأ! ✨', 'جاهز تماماً! 🚀', 'دعنا ننطلق! 💪']
        );
      }, 500);
    }
  }, [isAuthenticated, user, messages.length]);

  // AI Message sender with typing effect
  const sendAIMessage = useCallback(
    (content: string, step?: ConversationStep, newSuggestions: string[] = []) => {
      setIsTyping(true);
      setSuggestions([]);

      // Simulate typing delay (realistic)
      const typingDuration = Math.min(content.length * 20, 2000);

      setTimeout(() => {
        const aiMessage: ChatMessageType = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content,
          timestamp: new Date(),
          step,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
        setSuggestions(newSuggestions);

        if (step) {
          setCurrentStep(step);
        }
      }, typingDuration);
    },
    []
  );

  // Handle user message
  const handleUserMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: ChatMessageType = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setSuggestions([]);

      // Process based on current step
      await processConversationStep(content);
    },
    [currentStep, conversationData]
  );

  // Main conversation logic
  const processConversationStep = async (userInput: string) => {
    switch (currentStep) {
      case 'welcome':
        // Move to industry selection
        sendAIMessage(
          'رائع! متحمس جداً للعمل معك! 🎯\n\nدعنا نبدأ بمعرفة نوع نشاطك التجاري.\n\nاختر من الخيارات التالية أو اكتب نوع نشاطك:',
          'industry',
          industries.map((ind) => `${ind.icon} ${ind.name}`)
        );
        break;

      case 'industry':
        // Detect industry
        const detectedIndustry = detectIndustry(userInput);
        if (detectedIndustry) {
          setConversationData((prev) => ({ ...prev, industry: detectedIndustry.id }));
          sendAIMessage(
            `اختيار موفق! ${detectedIndustry.icon} ${detectedIndustry.name} مجال رائع! 💫\n\nفي PUIUX Click، نؤمن أن كل نشاط يستحق موقع مميز.\n\nالآن، ما اسم ${detectedIndustry.name === 'مطعم' ? 'مطعمك الرائع' : detectedIndustry.name === 'عيادة أسنان' ? 'عيادتك' : 'نشاطك'}؟`,
            'businessName'
          );
        } else {
          sendAIMessage(
            'عذراً يا صديقي، لم أتمكن من تحديد نوع النشاط بدقة 😅\n\nيرجى الاختيار من القائمة أو توضيح أكثر:',
            'industry',
            industries.map((ind) => `${ind.icon} ${ind.name}`)
          );
        }
        break;

      case 'businessName':
        setConversationData((prev) => ({ ...prev, businessName: userInput }));
        sendAIMessage(
          `واااو! "${userInput}" اسم رائع ومميز! 🌟✨\n\nأحب هذا الاسم! له وقع خاص.\n\nالآن، صف لي ${conversationData.industry === 'RESTAURANT' ? 'مطعمك' : 'نشاطك'} في سطر أو سطرين.\n\nما السر الذي يجعلك مختلفاً عن الآخرين؟ 🎯`,
          'description'
        );
        break;

      case 'description':
        setConversationData((prev) => ({ ...prev, description: userInput }));
        sendAIMessage(
          `مذهل! وصف واضح ومميز جداً! 📝💎\n\nأستطيع أن أرى الشغف في كلماتك! سيحب عملاؤك هذا.\n\nالآن، كيف يمكن للعملاء التواصل معك؟\n\nأدخل رقم هاتف، بريد إلكتروني، أو كلاهما:`,
          'contact',
          ['+966 50 123 4567', 'info@business.com', 'كلاهما']
        );
        break;

      case 'contact':
        // Extract contact info
        const contactInfo = extractContactInfo(userInput);
        setConversationData((prev) => ({
          ...prev,
          ...contactInfo,
        }));
        sendAIMessage(
          `ممتاز! معلومات التواصل مسجلة بنجاح ✅\n\nأنت رائع! وصلنا للخطوة الأخيرة! 🎉\n\nالآن، دعنا نختار نظام الألوان الذي يعكس شخصية علامتك التجارية 🎨\n\nاختر من الخيارات الاحترافية التالية:`,
          'colors',
          colorSchemes.map((cs) => cs.name)
        );
        break;

      case 'colors':
        // Detect color scheme
        const selectedScheme =
          colorSchemes.find((cs) => userInput.includes(cs.name)) || colorSchemes[0];
        setConversationData((prev) => ({ ...prev, colorPalette: selectedScheme }));

        // Start generation
        sendAIMessage(
          `اختيار رائع! ${selectedScheme.name} 🎨 سيكون مذهلاً!\n\nالآن، دع سحر PUIUX Click يعمل! ✨🚀\n\nجاري إنشاء موقعك الاحترافي بواسطة الذكاء الاصطناعي...\n\nهذا سيستغرق 10-15 ثانية فقط ⚡`,
          'generating'
        );

        // Create site
        await createSiteFromConversation();
        break;

      default:
        break;
    }
  };

  // Create site from conversation data
  const createSiteFromConversation = async () => {
    setIsCreating(true);

    try {
      // Prepare site data with proper validation
      const siteData: any = {
        name: conversationData.businessName,
        industry: conversationData.industry as any,
        businessName: conversationData.businessName,
        description: conversationData.description || undefined,
        address: conversationData.address || undefined,
        // Extract only allowed colorPalette properties
        colorPalette: {
          primary: conversationData.colorPalette.primary,
          secondary: conversationData.colorPalette.secondary,
          accent: conversationData.colorPalette.accent,
        },
      };

      // Only include email if it's valid
      if (conversationData.email && conversationData.email.includes('@')) {
        siteData.email = conversationData.email;
      }

      // Only include phone if it's not empty and has numbers
      if (conversationData.phone && conversationData.phone.replace(/\D/g, '').length >= 10) {
        siteData.phone = conversationData.phone;
      }

      const site = await createSite(siteData);

      // Store site ID
      setCreatedSiteId(site.id);

      // Trigger confetti
      setShowConfetti(true);

      // Success message (will be replaced by SuccessScreen)
      sendAIMessage(
        `🎉 مبروووك! تم بنجاح! 🎊\n\nموقع "${conversationData.businessName}" جاهز الآن! ✨\n\nتم إنشاء موقع احترافي كامل مع تصميم مذهل، جاهز للنشر فوراً! 🚀`,
        'complete'
      );

      // Success toast
      toast.success('🎉 تم إنشاء موقعك بنجاح!', {
        duration: 4000,
        icon: '✨',
      });
    } catch (error) {
      console.error('Failed to create site:', error);
      sendAIMessage(
        '😔 عذراً يا صديقي، حدث خطأ غير متوقع.\n\nلا تقلق! يمكننا المحاولة مرة أخرى.\n\nهل تريد إعادة المحاولة؟',
        currentStep,
        ['نعم، أعد المحاولة ✨', 'ابدأ من جديد 🔄']
      );
      toast.error('فشل في إنشاء الموقع. يرجى المحاولة مرة أخرى.', {
        duration: 5000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Restart conversation
  const handleRestart = () => {
    setMessages([]);
    setCurrentStep('welcome');
    setSuggestions([]);
    setConversationData({
      industry: null,
      businessName: '',
      description: '',
      phone: '',
      email: '',
      address: '',
      colorPalette: colorSchemes[0],
    });
  };

  // Helper: Detect industry from user input
  const detectIndustry = (input: string) => {
    const lowerInput = input.toLowerCase();
    return industries.find((ind) =>
      ind.keywords.some((keyword) => lowerInput.includes(keyword))
    );
  };

  // Helper: Extract contact info
  const extractContactInfo = (input: string) => {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const phoneRegex = /[\+\d][\d\s\-\(\)]+/g;

    const emails = input.match(emailRegex) || [];
    const phones = input.match(phoneRegex) || [];

    return {
      email: emails[0] || '',
      phone: phones[0] || '',
      address: input,
    };
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-gradient-to-br from-purple-50 via-background to-blue-50">
      {/* Floating Background Elements */}
      <FloatingElements />

      {/* Confetti Effect */}
      <ConfettiEffect active={showConfetti} duration={4000} />

      {/* Live Preview */}
      <LivePreview data={conversationData} currentStep={currentStep} />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 border-b bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <PixiAvatar size="md" animate />
              <div>
                <div className="flex items-center gap-2">
                  <Image
                    src="https://puiux.com/wp-content/uploads/2021/09/Logo-Black-Copress.svg"
                    alt="PUIUX Logo"
                    width={60}
                    height={20}
                    className="h-5 w-auto"
                  />
                  <span className="text-lg font-bold">Click</span>
                  <span className="text-xs rounded-full bg-purple-100 px-2 py-0.5 font-medium text-purple-700">
                    Chat AI
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">مساعدك الذكي بيكسي ✨</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                aria-label="إعادة البدء"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">إعادة البدء</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                aria-label="لوحة التحكم"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden sm:inline">لوحة التحكم</span>
              </motion.button>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mt-4">
            <ProgressTracker currentStep={currentStep} />
          </div>
        </div>
      </motion.header>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="relative z-10 flex-1 overflow-y-auto px-4 py-6"
        role="log"
        aria-live="polite"
        aria-label="محادثة بناء الموقع"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {/* Show Success Screen when complete */}
          {currentStep === 'complete' && createdSiteId ? (
            <SuccessScreen
              data={conversationData}
              onViewSite={() => router.push(`/sites/${createdSiteId}/edit`)}
            />
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLatest={index === messages.length - 1}
                  />
                ))}
              </AnimatePresence>

              {isTyping && <TypingIndicator />}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {currentStep !== 'complete' && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 border-t bg-background/80 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-3xl px-4 py-4">
            <ChatInput
              onSend={handleUserMessage}
              suggestions={suggestions}
              placeholder={
                isCreating
                  ? 'جاري إنشاء موقعك بالذكاء الاصطناعي... ⚡'
                  : 'اكتب إجابتك أو اختر من الاقتراحات... ✨'
              }
              disabled={isTyping || isCreating}
            />
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <ChatFooter />
    </div>
  );
}
