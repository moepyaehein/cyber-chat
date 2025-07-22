
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ClientMessage } from '@/app/actions';
import { useAuth } from './AuthContext';

const initialMessage: ClientMessage = {
  id: 'initial-message',
  sender: 'ai',
  text: "Hello! I'm CyGuard. Paste a suspicious message, link, or attach a screenshot below. You can save this chat session from the 'New Chat' button.",
  isLoading: false,
};

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: ClientMessage[];
}

interface ChatHistoryContextType {
  savedChats: ChatSession[];
  activeChat: ChatSession;
  setActiveChat: Dispatch<SetStateAction<ChatSession>>;
  loadChat: (chatId: string) => void;
  startNewChat: () => void;
  saveCurrentChat: (title: string) => void;
  deleteChat: (chatId: string) => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

const createNewChat = (title = "New Chat"): ChatSession => ({
  id: uuidv4(),
  title,
  timestamp: Date.now(),
  messages: [initialMessage],
});

export const ChatHistoryProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [savedChats, setSavedChats] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<ChatSession>(createNewChat());
  
  const storageKey = `cyguard-chat-history-${user?.uid}`;

  // Load saved chats from localStorage on mount
  useEffect(() => {
    if (!user) return; // Don't load if no user
    try {
      const savedHistory = localStorage.getItem(storageKey);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setSavedChats(parsedHistory);
        }
      }
    } catch (error) {
      console.error("Could not load chat history from localStorage", error);
    }
  }, [user, storageKey]);

  // Effect to update localStorage whenever savedChats changes
  const _updateStorage = (chats: ChatSession[]) => {
    if (!user) return;
    try {
        localStorage.setItem(storageKey, JSON.stringify(chats));
    } catch (error) {
        console.error("Could not save chat history to localStorage", error);
    }
  };

  const loadChat = (chatId: string) => {
    const chatToLoad = savedChats.find(c => c.id === chatId);
    if (chatToLoad) {
      setActiveChat(chatToLoad);
    }
  };

  const startNewChat = () => {
    setActiveChat(createNewChat());
  };

  const saveCurrentChat = (title: string) => {
    const existingChatIndex = savedChats.findIndex(c => c.id === activeChat.id);
    let updatedChats;

    const chatToSave = {
        ...activeChat,
        title, // Update title
        timestamp: Date.now(), // Update timestamp
    };
    
    if (existingChatIndex > -1) {
      // Update existing chat
      updatedChats = savedChats.map((c, index) => index === existingChatIndex ? chatToSave : c);
    } else {
      // Add new chat
      updatedChats = [...savedChats, chatToSave];
    }
    
    // Sort by most recent
    updatedChats.sort((a,b) => b.timestamp - a.timestamp);

    setSavedChats(updatedChats);
    _updateStorage(updatedChats);
  };

  const deleteChat = (chatId: string) => {
    const updatedChats = savedChats.filter(c => c.id !== chatId);
    setSavedChats(updatedChats);
    _updateStorage(updatedChats);

    // If the deleted chat was the active one, start a new chat
    if (activeChat.id === chatId) {
      startNewChat();
    }
  };

  return (
    <ChatHistoryContext.Provider value={{
      savedChats,
      activeChat,
      setActiveChat,
      loadChat,
      startNewChat,
      saveCurrentChat,
      deleteChat
    }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
};
