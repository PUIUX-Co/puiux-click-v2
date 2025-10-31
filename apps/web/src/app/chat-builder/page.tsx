'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import ChatMessage from '@/components/chat/ChatMessage';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ChatInput from '@/components/chat/ChatInput';
import ProgressTracker from '@/components/chat/ProgressTracker';
import { useAuth } from '@/contexts/AuthContext';
import { createSite } from '@/lib/api/sites';

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

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/chat-builder-new');
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
          `مرحباً ${user?.name || ''}! 👋\n\nأنا مساعدك الذكي في PUIUX Click. سأساعدك في إنشاء موقعك الاحترافي من خلال محادثة بسيطة.\n\nالعملية ستستغرق فقط 2-4 دقائق! 🚀\n\nهل أنت جاهز للبدء؟`,
          'welcome',
          ['نعم، لنبدأ! ✨', 'جاهز! 🚀']
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
          'رائع! لنبدأ 🎯\n\nما نوع نشاطك التجاري؟\n\nاختر من القائمة أو اكتب نوع نشاطك:',
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
            `ممتاز! ${detectedIndustry.icon} ${detectedIndustry.name}\n\nالآن، ما اسم ${detectedIndustry.name === 'مطعم' ? 'مطعمك' : detectedIndustry.name === 'عيادة أسنان' ? 'عيادتك' : 'نشاطك'}؟`,
            'businessName'
          );
        } else {
          sendAIMessage(
            'عذراً، لم أتمكن من تحديد نوع النشاط. يرجى الاختيار من القائمة أو التوضيح أكثر:',
            'industry',
            industries.map((ind) => `${ind.icon} ${ind.name}`)
          );
        }
        break;

      case 'businessName':
        setConversationData((prev) => ({ ...prev, businessName: userInput }));
        sendAIMessage(
          `جميل! "${userInput}" اسم رائع 🌟\n\nالآن، صف لي ${conversationData.industry === 'RESTAURANT' ? 'مطعمك' : 'نشاطك'} في سطر أو سطرين.\n\nما الذي يميزك عن المنافسين؟`,
          'description'
        );
        break;

      case 'description':
        setConversationData((prev) => ({ ...prev, description: userInput }));
        sendAIMessage(
          `ممتاز! وصف واضح ومميز 📝\n\nكيف يمكن للعملاء التواصل معك؟\n\nأدخل رقم هاتف، أو بريد إلكتروني، أو كلاهما:`,
          'contact',
          ['+966 50 123 4567', 'info@example.com']
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
          `تمام! معلومات التواصل مسجلة ✅\n\nالآن لنختار نظام الألوان لموقعك 🎨\n\nاختر من الخيارات التالية:`,
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
          `اختيار موفق! ${selectedScheme.name} 🎨\n\nجاري إنشاء موقعك الآن...\n\nهذا قد يستغرق 10-15 ثانية فقط ⚡`,
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
      const site = await createSite({
        name: conversationData.businessName,
        industry: conversationData.industry as any,
        businessName: conversationData.businessName,
        description: conversationData.description,
        email: conversationData.email,
        phone: conversationData.phone,
        address: conversationData.address,
        colorPalette: conversationData.colorPalette,
      });

      // Success message
      sendAIMessage(
        `🎉 تم! موقعك جاهز!\n\n"${conversationData.businessName}" أصبح الآن لديه موقع احترافي كامل.\n\nجاري توجيهك للمحرر لتخصيص موقعك...`,
        'complete'
      );

      // Success toast
      toast.success('تم إنشاء موقعك بنجاح! 🎉');

      // Redirect to editor
      setTimeout(() => {
        router.push(`/sites/${site.id}/edit`);
      }, 2000);
    } catch (error) {
      console.error('Failed to create site:', error);
      sendAIMessage(
        '😔 عذراً، حدث خطأ أثناء إنشاء الموقع.\n\nهل تريد المحاولة مرة أخرى؟',
        currentStep,
        ['نعم، أعد المحاولة', 'العودة للبداية']
      );
      toast.error('فشل في إنشاء الموقع. يرجى المحاولة مرة أخرى.');
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
    <div className="flex h-screen flex-col bg-gradient-to-br from-purple-50 via-background to-blue-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Chat AI Builder</h1>
                <p className="text-xs text-muted-foreground">محادثة ذكية - موقع احترافي</p>
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
        className="flex-1 overflow-y-auto px-4 py-6"
        role="log"
        aria-live="polite"
        aria-label="محادثة بناء الموقع"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-t bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-3xl px-4 py-4">
          <ChatInput
            onSend={handleUserMessage}
            suggestions={suggestions}
            placeholder={
              isCreating
                ? 'جاري إنشاء موقعك...'
                : currentStep === 'complete'
                ? 'اكتمل! 🎉'
                : 'اكتب إجابتك...'
            }
            disabled={isTyping || isCreating || currentStep === 'complete'}
          />
        </div>
      </motion.div>
    </div>
  );
}
