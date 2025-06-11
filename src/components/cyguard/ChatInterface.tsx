'use client';

import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessageItem, { type Message as ChatMessageType } from './ChatMessageItem';
import { handleUserMessage } from '@/app/actions';
import { SendHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const chatFormSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message is too long'),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

interface ChatInterfaceProps {}

const ChatInterface: FC<ChatInterfaceProps> = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: uuidv4(),
      sender: 'ai',
      text: "Hello! I'm CyGuard. How can I help you assess a potential online threat today? Paste any suspicious message or link below. For example, try:\n```json\n{\n  \"url\": \"http://suspicious-site.com/login.php\",\n  \"email_sender\": \"attacker@phish.net\"\n}\n```",
      isLoading: false,
    }
  ]);
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null); // Changed to target viewport for ScrollArea

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
  });

  useEffect(() => {
    if (scrollViewportRef.current) {
      // Access the viewport element directly if ScrollArea passes it via ref
      // For ShadCN ScrollArea, the ref is on the Root, viewport is internal.
      // A common pattern is to get the first child of the ScrollArea for the scrollable content.
      const viewport = scrollViewportRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      } else {
         // Fallback for direct div if not using ShadCN's viewport structure
         scrollViewportRef.current.scrollTo({ top: scrollViewportRef.current.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);
  
  useEffect(() => {
    if (errors.message) {
      toast({
        title: "Input Error",
        description: errors.message.message,
        variant: "destructive",
      });
    }
  }, [errors.message, toast]);

  const onSubmit: SubmitHandler<ChatFormValues> = async (data) => {
    const userMessageId = uuidv4();
    const userMessage: ChatMessageType = {
      id: userMessageId,
      sender: 'user',
      text: data.message,
      isLoading: false,
    };

    const aiThinkingMessageId = uuidv4();
    const aiThinkingMessage: ChatMessageType = {
      id: aiThinkingMessageId,
      sender: 'ai',
      text: '', 
      isLoading: true,
    };

    setMessages(prevMessages => [...prevMessages, userMessage, aiThinkingMessage]);
    reset();

    const result = await handleUserMessage(aiThinkingMessageId, data.message);

    if ('error' in result) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
      setMessages(prev => prev.filter(msg => msg.id !== aiThinkingMessageId)); 
    } else {
      setMessages(prevMessages => 
        prevMessages.map(msg => msg.id === aiThinkingMessageId ? { ...result, id: aiThinkingMessageId } : msg)
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent"> {/* Changed bg-background to transparent */}
      <ScrollArea className="flex-grow px-1 md:px-2" ref={scrollViewportRef}> {/* Use ref here */}
        <div className="space-y-1 pb-4"> {/* Reduced space-y */}
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-border p-3 md:p-4 bg-card/50 backdrop-blur-sm shadow- ऊपर">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 md:gap-3">
          <Input
            {...register('message')}
            placeholder="Type your suspicious message or link here..."
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
  );
};

export default ChatInterface;
