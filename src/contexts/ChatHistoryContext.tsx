
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ClientMessage } from '@/app/actions';
import { useAuth } from './AuthContext';
import { firestore } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

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
  saveCurrentChat: (title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  isLoading: boolean;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

const createNewChat = (title = "New Chat"): ChatSession => ({
  id: uuidv4(),
  title,
  timestamp: Date.now(),
  messages: [initialMessage],
});

// Helper function to remove undefined values, which are not supported by Firestore
const sanitizeForFirestore = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item));
  }

  const newObj: {[key: string]: any} = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      newObj[key] = sanitizeForFirestore(obj[key]);
    }
  }
  return newObj;
};


export const ChatHistoryProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [savedChats, setSavedChats] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<ChatSession>(createNewChat());
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Effect to listen for real-time updates from Firestore
  useEffect(() => {
    if (!user) {
      setSavedChats([]);
      setActiveChat(createNewChat());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const chatsCollectionRef = collection(firestore, `users/${user.uid}/chats`);
    const q = query(chatsCollectionRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chats: ChatSession[] = [];
      querySnapshot.forEach((doc) => {
        chats.push(doc.data() as ChatSession);
      });
      setSavedChats(chats);
      
      // Prevent resetting active chat on subsequent updates unless it was deleted
      if (isInitialLoad) {
          setActiveChat(chats[0] || createNewChat());
          setIsInitialLoad(false);
      } else {
         const activeChatExists = chats.some(c => c.id === activeChat.id);
         if (!activeChatExists) {
            setActiveChat(chats[0] || createNewChat());
         }
      }

      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching chat history from Firestore:", error);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user, isInitialLoad, activeChat.id]);

  const loadChat = (chatId: string) => {
    const chatToLoad = savedChats.find(c => c.id === chatId);
    if (chatToLoad) {
      setActiveChat(chatToLoad);
    }
  };

  const startNewChat = () => {
    setActiveChat(createNewChat());
  };

  const saveCurrentChat = async (title: string) => {
    if (!user) {
      console.error("Cannot save chat: no user logged in.");
      return;
    }

    const chatToSave: ChatSession = {
      ...activeChat,
      title, // Update title with user-provided one
      timestamp: Date.now(), // Update timestamp on save
    };
    
    const sanitizedChat = sanitizeForFirestore(chatToSave);

    try {
      const chatDocRef = doc(firestore, `users/${user.uid}/chats`, sanitizedChat.id);
      await setDoc(chatDocRef, sanitizedChat);
      
      // If it was a new chat, it will now be part of the snapshot listener's update.
      // We can also optimistically update the state if needed, but the listener handles it.
      setActiveChat(chatToSave); // Ensure active chat has the new title

    } catch (error) {
      console.error("Error saving chat to Firestore:", error);
    }
  };

  const deleteChat = async (chatId: string) => {
     if (!user) {
      console.error("Cannot delete chat: no user logged in.");
      return;
    }
    
    try {
        const chatDocRef = doc(firestore, `users/${user.uid}/chats`, chatId);
        await deleteDoc(chatDocRef);
        // The onSnapshot listener will automatically update the UI.
        // If the deleted chat was the active one, the useEffect will handle resetting it.
    } catch (error) {
        console.error("Error deleting chat from Firestore:", error);
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
      deleteChat,
      isLoading
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
