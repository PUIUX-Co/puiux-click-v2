/**
 * History Manager
 *
 * Manages conversation history for Chat AI and Voice Builder
 * Saves to localStorage to reduce API calls
 */

import type { ConversationData } from '@/types/chat';
import type { VoiceConversationData } from '@/types/voice';

interface ChatHistory {
  type: 'chat';
  data: ConversationData;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  expiresAt: string;
}

interface VoiceHistory {
  type: 'voice';
  data: VoiceConversationData;
  messages: Array<{
    role: string;
    transcript: string;
    timestamp: string;
  }>;
  dialect: string;
  createdAt: string;
  expiresAt: string;
}

type BuilderHistory = ChatHistory | VoiceHistory;

const CHAT_HISTORY_KEY = 'puiux_chat_history';
const VOICE_HISTORY_KEY = 'puiux_voice_history';
const HISTORY_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class HistoryManager {
  /**
   * Save Chat AI Builder history
   */
  static saveChatHistory(data: ConversationData, messages: any[]): void {
    if (typeof window === 'undefined') return;

    try {
      const history: ChatHistory = {
        type: 'chat',
        data,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString(),
        })),
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + HISTORY_DURATION).toISOString(),
      };

      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  /**
   * Get Chat AI Builder history
   */
  static getChatHistory(): ChatHistory | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(CHAT_HISTORY_KEY);
      if (!stored) return null;

      const history: ChatHistory = JSON.parse(stored);

      // Check if expired
      if (new Date(history.expiresAt) < new Date()) {
        this.clearChatHistory();
        return null;
      }

      return history;
    } catch (error) {
      console.error('Failed to get chat history:', error);
      return null;
    }
  }

  /**
   * Clear Chat AI Builder history
   */
  static clearChatHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CHAT_HISTORY_KEY);
  }

  /**
   * Save Voice Builder history
   */
  static saveVoiceHistory(
    data: VoiceConversationData,
    messages: any[],
    dialect: string
  ): void {
    if (typeof window === 'undefined') return;

    try {
      const history: VoiceHistory = {
        type: 'voice',
        data,
        messages: messages.map((msg) => ({
          role: msg.role,
          transcript: msg.transcript,
          timestamp: msg.timestamp.toISOString(),
        })),
        dialect,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + HISTORY_DURATION).toISOString(),
      };

      localStorage.setItem(VOICE_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save voice history:', error);
    }
  }

  /**
   * Get Voice Builder history
   */
  static getVoiceHistory(): VoiceHistory | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(VOICE_HISTORY_KEY);
      if (!stored) return null;

      const history: VoiceHistory = JSON.parse(stored);

      // Check if expired
      if (new Date(history.expiresAt) < new Date()) {
        this.clearVoiceHistory();
        return null;
      }

      return history;
    } catch (error) {
      console.error('Failed to get voice history:', error);
      return null;
    }
  }

  /**
   * Clear Voice Builder history
   */
  static clearVoiceHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(VOICE_HISTORY_KEY);
  }

  /**
   * Check if there's any recent history
   */
  static hasRecentHistory(type: 'chat' | 'voice'): boolean {
    if (type === 'chat') {
      return this.getChatHistory() !== null;
    } else {
      return this.getVoiceHistory() !== null;
    }
  }

  /**
   * Clear all history
   */
  static clearAll(): void {
    this.clearChatHistory();
    this.clearVoiceHistory();
  }
}
