'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

import VoiceRecorder from '@/components/voice/VoiceRecorder';
import VoiceMessage from '@/components/voice/VoiceMessage';
import PixiAvatar from '@/components/chat/PixiAvatar';
import ConfettiEffect from '@/components/chat/ConfettiEffect';
import FloatingElements from '@/components/chat/FloatingElements';
import ChatFooter from '@/components/chat/ChatFooter';
import SuccessScreen from '@/components/chat/SuccessScreen';

import { useAuth } from '@/contexts/AuthContext';
import { createSite } from '@/lib/api/sites';
import { VoiceAI } from '@/lib/voiceAI';
import { HistoryManager } from '@/lib/historyManager';

import type {
  VoiceMessage as VoiceMessageType,
  VoiceDialect,
  RecordingStatus,
  VoiceConversationData,
} from '@/types/voice';
import { supportedDialects, dialectResponses } from '@/types/voice';
import { colorSchemes } from '@/types/chat';

type ConversationStep =
  | 'welcome'
  | 'industry'
  | 'businessName'
  | 'description'
  | 'contact'
  | 'colors'
  | 'generating'
  | 'complete';

export default function VoiceBuilderPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State
  const [messages, setMessages] = useState<VoiceMessageType[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('welcome');
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [selectedDialect, setSelectedDialect] = useState<VoiceDialect>('saudi-najdi');
  const [showDialectSelector, setShowDialectSelector] = useState(true);
  const [conversationData, setConversationData] = useState<VoiceConversationData>({
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
      router.push('/auth/login?redirect=/voice-builder');
    }
  }, [isAuthenticated, router]);

  // Check for history
  useEffect(() => {
    if (isAuthenticated) {
      const history = HistoryManager.getVoiceHistory();
      if (history) {
        toast((t) => (
          <div className="flex flex-col gap-2">
            <p className="font-bold">لديك محادثة سابقة!</p>
            <p className="text-sm">هل تريد المتابعة من حيث توقفت؟</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Restore history
                  setConversationData(history.data);
                  setSelectedDialect(history.dialect as VoiceDialect);
                  toast.dismiss(t.id);
                  toast.success('تم استرجاع المحادثة!');
                }}
                className="rounded bg-primary px-3 py-1 text-sm text-white"
              >
                نعم
              </button>
              <button
                onClick={() => {
                  HistoryManager.clearVoiceHistory();
                  toast.dismiss(t.id);
                }}
                className="rounded bg-gray-200 px-3 py-1 text-sm"
              >
                لا، ابدأ من جديد
              </button>
            </div>
          </div>
        ), { duration: 10000 });
      }
    }
  }, [isAuthenticated]);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Save history on data change
  useEffect(() => {
    if (messages.length > 0) {
      HistoryManager.saveVoiceHistory(conversationData, messages, selectedDialect);
    }
  }, [conversationData, messages, selectedDialect]);

  // Initialize with greeting after dialect selection
  const startConversation = (dialect: VoiceDialect) => {
    setSelectedDialect(dialect);
    setShowDialectSelector(false);

    setTimeout(() => {
      const greeting = dialectResponses[dialect].welcome;
      speak(greeting);

      const message: VoiceMessageType = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        transcript: greeting,
        timestamp: new Date(),
        dialect,
      };

      setMessages([message]);
      setCurrentStep('industry');
    }, 500);
  };

  // Handle user transcript
  const handleTranscript = useCallback(
    async (transcript: string) => {
      if (!transcript.trim() || status === 'processing') return;

      // Normalize transcript
      const normalized = VoiceAI.normalizeTranscript(transcript);

      // Add user message
      const userMessage: VoiceMessageType = {
        id: `user-${Date.now()}`,
        role: 'user',
        transcript: normalized,
        timestamp: new Date(),
        dialect: selectedDialect,
        confidence: 0.9, // Mock confidence
      };

      setMessages((prev) => [...prev, userMessage]);
      setStatus('processing');

      // Extract keywords
      const keywords = VoiceAI.extractKeywords(normalized);

      // Process based on current step
      await processConversationStep(normalized, keywords);
    },
    [currentStep, selectedDialect, status, conversationData]
  );

  // Main conversation logic
  const processConversationStep = async (transcript: string, keywords: any) => {
    let response = '';
    const responses = dialectResponses[selectedDialect];

    switch (currentStep) {
      case 'industry':
        if (keywords.industry && keywords.industry[0]) {
          const industry = keywords.industry[0];
          setConversationData((prev) => ({ ...prev, industry }));

          const industryName = industry === 'RESTAURANT' ? 'مطعمك' :
                              industry === 'DENTAL' ? 'عيادتك' : 'نشاطك';
          response = responses.industryConfirm(industryName);
          setCurrentStep('businessName');
        } else {
          response = responses.error;
        }
        break;

      case 'businessName':
        const businessName = keywords.businessName || transcript;
        setConversationData((prev) => ({ ...prev, businessName }));
        response = responses.nameConfirm(businessName);
        setCurrentStep('description');
        break;

      case 'description':
        setConversationData((prev) => ({ ...prev, description: transcript }));
        response = responses.descriptionConfirm;
        setCurrentStep('contact');
        break;

      case 'contact':
        if (keywords.contact) {
          setConversationData((prev) => ({
            ...prev,
            phone: keywords.contact.phone || prev.phone,
            email: keywords.contact.email || prev.email,
            address: keywords.contact.address || prev.address,
          }));
        }
        response = responses.contactConfirm;
        setCurrentStep('colors');
        break;

      case 'colors':
        const colors = keywords.colors || [];
        const selectedScheme = colors.length > 0
          ? VoiceAI.mapColorToScheme(colors[0])
          : colorSchemes[0];

        setConversationData((prev) => ({ ...prev, colorPalette: selectedScheme }));
        response = responses.colorConfirm(selectedScheme.name);
        setCurrentStep('generating');

        // Create site after responding
        setTimeout(() => createSiteFromConversation(), 2000);
        break;

      default:
        response = responses.error;
    }

    // Send AI response
    await sendAIMessage(response);
    setStatus('idle');
  };

  // Send AI message with speech
  const sendAIMessage = async (content: string) => {
    const message: VoiceMessageType = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      transcript: content,
      timestamp: new Date(),
      dialect: selectedDialect,
    };

    setMessages((prev) => [...prev, message]);
    await speak(content);
  };

  // Text-to-Speech
  const speak = async (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    setStatus('speaking');

    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = supportedDialects[selectedDialect].langCode;
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setStatus('idle');
        resolve();
      };

      utterance.onerror = () => {
        setStatus('idle');
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  // Create site
  const createSiteFromConversation = async () => {
    setIsCreating(true);
    setStatus('processing');

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

      setCreatedSiteId(site.id);
      setShowConfetti(true);
      setCurrentStep('complete');

      const successMsg = dialectResponses[selectedDialect].success;
      await sendAIMessage(successMsg);

      toast.success('🎉 تم إنشاء موقعك بنجاح!', {
        duration: 4000,
        icon: '✨',
      });
    } catch (error) {
      console.error('Failed to create site:', error);
      const errorMsg = dialectResponses[selectedDialect].error;
      await sendAIMessage(errorMsg);
      toast.error('فشل في إنشاء الموقع', { duration: 5000 });
    } finally {
      setIsCreating(false);
      setStatus('idle');
    }
  };

  // Restart
  const handleRestart = () => {
    window.speechSynthesis.cancel();
    setMessages([]);
    setCurrentStep('welcome');
    setStatus('idle');
    setConversationData({
      industry: null,
      businessName: '',
      description: '',
      phone: '',
      email: '',
      address: '',
      colorPalette: colorSchemes[0],
    });
    setShowDialectSelector(true);
    HistoryManager.clearVoiceHistory();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-gradient-to-br from-purple-50 via-background to-blue-50">
      <FloatingElements />
      <ConfettiEffect active={showConfetti} duration={4000} />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 border-b bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
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
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                    Voice AI
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">تكلم مع بيكسي 🎤✨</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">إعادة البدء</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden sm:inline">لوحة التحكم</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Dialect Selector */}
        <AnimatePresence>
          {showDialectSelector && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex h-full items-center justify-center p-4"
            >
              <div className="w-full max-w-2xl rounded-3xl border-2 bg-white p-8 shadow-2xl">
                <h2 className="mb-6 text-center text-3xl font-bold">
                  اختر لهجتك المفضلة 🗣️
                </h2>
                <p className="mb-8 text-center text-lg text-muted-foreground">
                  بيكسي هيتكلم معاك باللهجة اللي تحبها!
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  {Object.values(supportedDialects).map((dialect) => (
                    <motion.button
                      key={dialect.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startConversation(dialect.id as VoiceDialect)}
                      className="flex flex-col items-center gap-3 rounded-2xl border-2 border-primary/20 p-6 transition-all hover:border-primary hover:bg-primary/5"
                    >
                      <span className="text-5xl">{dialect.icon}</span>
                      <span className="text-xl font-bold">{dialect.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages + Voice Recorder */}
        {!showDialectSelector && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="mx-auto max-w-3xl">
                {currentStep === 'complete' && createdSiteId ? (
                  <SuccessScreen
                    data={conversationData as any}
                    onViewSite={() => router.push(`/sites/${createdSiteId}/edit`)}
                  />
                ) : (
                  <>
                    <AnimatePresence mode="popLayout">
                      {messages.map((message, index) => (
                        <VoiceMessage
                          key={message.id}
                          message={message}
                          isLatest={index === messages.length - 1}
                          isSpeaking={status === 'speaking' && message.role === 'assistant'}
                        />
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </div>

            {/* Voice Recorder */}
            {currentStep !== 'complete' && (
              <div className="border-t bg-background/80 py-8 backdrop-blur-xl">
                <VoiceRecorder
                  onTranscript={handleTranscript}
                  status={status}
                  disabled={isCreating}
                  lang={supportedDialects[selectedDialect].langCode}
                />
              </div>
            )}
          </>
        )}
      </div>

      <ChatFooter />
    </div>
  );
}
