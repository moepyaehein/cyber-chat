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
      text: "Hello! I'm CyGuard. How can I help you assess a potential online threat today? Paste any suspicious message or link below.",
      isLoading: false,
    }
  ]);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
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
      text: '', // Placeholder, will be updated or replaced
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
      setMessages(prev => prev.filter(msg => msg.id !== aiThinkingMessageId)); // Remove thinking message
    } else {
       // Replace the thinking message with the actual AI response
      setMessages(prevMessages => 
        prevMessages.map(msg => msg.id === aiThinkingMessageId ? { ...result, id: aiThinkingMessageId } : msg)
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-border p-4 bg-card shadow- ऊपर">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-3">
          <Input
            {...register('message')}
            placeholder="Type your suspicious message or link here..."
            className="flex-grow text-base"
            autoComplete="off"
            disabled={isSubmitting}
          />
          <Button type="submit" size="icon" disabled={isSubmitting} aria-label="Send message">
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
