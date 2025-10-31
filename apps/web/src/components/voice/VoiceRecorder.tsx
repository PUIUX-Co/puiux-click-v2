'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import type { RecordingStatus } from '@/types/voice';

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
  status: RecordingStatus;
  disabled?: boolean;
  lang?: string;
}

export default function VoiceRecorder({
  onTranscript,
  status,
  disabled = false,
  lang = 'ar-SA',
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onTranscript(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (isRecording) {
        // Restart if still should be recording
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [lang, isRecording, onTranscript]);

  // Audio level visualization
  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current || !isRecording) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (error) {
      console.error('Failed to access microphone:', error);
    }
  };

  const stopAudioMonitoring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  const toggleRecording = () => {
    if (disabled) return;

    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopAudioMonitoring();
      setIsRecording(false);
    } else {
      // Start recording
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      startAudioMonitoring();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Waveform Visualization */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center gap-1"
          >
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-primary to-purple-600"
                animate={{
                  height: [
                    20 + audioLevel * 40,
                    40 + audioLevel * 60,
                    20 + audioLevel * 40,
                  ],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: 'easeInOut',
                }}
                style={{ height: 20 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Record Button - VERY LARGE for accessibility */}
      <motion.button
        onClick={toggleRecording}
        disabled={disabled || status === 'processing' || status === 'speaking'}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className={`relative flex h-32 w-32 items-center justify-center rounded-full shadow-2xl transition-all sm:h-40 sm:w-40 ${
          isRecording
            ? 'bg-gradient-to-br from-red-500 to-pink-600'
            : 'bg-gradient-to-br from-primary via-blue-600 to-purple-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label={isRecording ? 'إيقاف التسجيل' : 'ابدأ التسجيل'}
      >
        {/* Pulse effect when recording */}
        {isRecording && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-pink-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
                ease: 'easeOut',
              }}
            />
          </>
        )}

        {/* Icon */}
        <div className="relative z-10">
          {isRecording ? (
            <MicOff className="h-16 w-16 text-white sm:h-20 sm:w-20" />
          ) : status === 'speaking' ? (
            <Volume2 className="h-16 w-16 text-white sm:h-20 sm:w-20" />
          ) : (
            <Mic className="h-16 w-16 text-white sm:h-20 sm:w-20" />
          )}
        </div>

        {/* Recording indicator dot */}
        {isRecording && (
          <motion.div
            className="absolute right-4 top-4 h-4 w-4 rounded-full bg-white"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>

      {/* Status Text - LARGE and CLEAR */}
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-2xl font-bold sm:text-3xl">
          {isRecording ? (
            <span className="text-red-600">🎤 أنا أستمع إليك...</span>
          ) : status === 'processing' ? (
            <span className="text-blue-600">⚡ بيكسي يفكر...</span>
          ) : status === 'speaking' ? (
            <span className="text-purple-600">🔊 بيكسي يتكلم...</span>
          ) : (
            <span className="text-gray-600">اضغط للتحدث 🎤</span>
          )}
        </p>
        {!isRecording && status === 'idle' && (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            اضغط على الزر وتكلم بكل راحة
          </p>
        )}
      </motion.div>

      {/* Instructions for elderly/illiterate - VERY SIMPLE */}
      {!isRecording && status === 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 rounded-2xl bg-blue-50 p-6 text-center"
        >
          <p className="text-xl font-bold text-blue-900">💡 كيف تستخدمه؟</p>
          <ol className="mt-4 space-y-3 text-right text-lg text-blue-800">
            <li className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <span>اضغط على الزر الدائري الكبير</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <span>تكلم بصوت واضح عن نشاطك</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <span>بيكسي هيفهمك ويرد عليك بالصوت!</span>
            </li>
          </ol>
        </motion.div>
      )}
    </div>
  );
}
