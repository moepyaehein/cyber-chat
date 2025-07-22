
'use client';

import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessageItem from './ChatMessageItem';
import { handleUserMessage } from '@/app/actions';
import { SendHorizontal, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import type { ClientMessage } from '@/app/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AnalyzeScreenshotDialog from './AnalyzeScreenshotDialog';
import { ScanSearch } from 'lucide-react';

const chatFormSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.').max(2000, 'Message is too long'),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

const initialMessage: ClientMessage = {
  id: 'initial-message',
  sender: 'ai',
  text: "Hello! I'm CyGuard. Paste a suspicious message or link below. Your chat is saved in this browser and you can clear it at any time.",
  isLoading: false,
};

const CHAT_HISTORY_KEY = 'cyguard_chat_history';

const ChatInterface: FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ClientMessage[]>([initialMessage]);
  const [isScreenshotDialogOpen, setScreenshotDialogOpen] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
  });

  // Load chat history from local storage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        setMessages(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load chat history from local storage:", error);
      setMessages([initialMessage]);
    }
  }, []);

  // Save chat history to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history to local storage:", error);
    }
  }, [messages]);
  
  useEffect(() => {
    if (scrollViewportRef.current) {
        const viewport = scrollViewportRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        } else {
            scrollViewportRef.current.scrollTo({ top: scrollViewportRef.current.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [messages]);
  
  useEffect(() => {
    if (errors.message) {
      toast({ title: "Input Error", description: errors.message.message, variant: "destructive" });
    }
  }, [errors.message, toast]);

  const handleClearHistory = () => {
    setMessages([initialMessage]);
    toast({ title: "Chat Cleared", description: "Your conversation has been cleared from this browser." });
  };

  const onSubmit: SubmitHandler<ChatFormValues> = async (data) => {
    const userMessageId = uuidv4();
    const userMessage: ClientMessage = {
      id: userMessageId,
      sender: 'user',
      text: data.message,
      isLoading: false,
    };

    const aiThinkingMessageId = uuidv4();
    const aiThinkingMessage: ClientMessage = {
      id: aiThinkingMessageId,
      sender: 'ai',
      text: '', 
      isLoading: true,
    };
    
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages.concat(aiThinkingMessage));
    reset();

    const history = currentMessages
      .filter(m => !m.isLoading && m.id !== 'initial-message' && !m.screenshotAnalysis)
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

    const result = await handleUserMessage(aiThinkingMessageId, data.message, history);

    if ('error' in result) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
      setMessages(prev => prev.filter(msg => msg.id !== aiThinkingMessageId)); 
    } else {
      setMessages(prev => prev.map(msg => msg.id === aiThinkingMessageId ? { ...result, id: aiThinkingMessageId } : msg));
    }
  };

  return (
    <>
    <div className="flex flex-col h-full bg-transparent">
        <div className="flex-shrink-0 flex items-center justify-between p-3 border-b gap-2">
            <h2 className="text-lg font-semibold truncate pr-4">CyGuard Chat</h2>
            <div className='flex items-center gap-2'>
              <Button variant="outline" size="sm" onClick={() => setScreenshotDialogOpen(true)}>
                <ScanSearch className="h-4 w-4 mr-2"/>
                Analyze Screenshot
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={messages.length <= 1}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your current chat history from this browser. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearHistory}>
                      Yes, clear history
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
        </div>
      <ScrollArea className="flex-grow px-1 md:px-2" ref={scrollViewportRef}>
        <div className="space-y-1 pb-4 pt-4">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-border p-3 md:p-4 bg-card/50 backdrop-blur-sm shadow- ऊपर">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 md:gap-3">
          <Input
            {...register('message')}
            placeholder="Paste text or a suspicious link..."
            className="flex-grow text-sm bg-background/70 focus:bg-background"
            autoComplete="off"
            disabled={isSubmitting}
          />
          <Button type="submit" size="icon" disabled={isSubmitting} aria-label="Send message" className="shrink-0">
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
    <AnalyzeScreenshotDialog isOpen={isScreenshotDialogOpen} onOpenChange={setScreenshotDialogOpen} />
    </>
  );
};

export default ChatInterface;
