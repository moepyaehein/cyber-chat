
'use client';

import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessageItem, { type Message as ChatMessageType } from './ChatMessageItem';
import { handleUserMessage } from '@/app/actions';
import { SendHorizontal, Paperclip, X, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
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
} from "@/components/ui/alert-dialog"


const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const chatFormSchema = z.object({
  message: z.string().max(2000, 'Message is too long').optional(),
  image: z
    .custom<FileList>()
    .optional()
    .refine((files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
}).refine(data => data.message || (data.image && data.image.length > 0), {
    message: 'Message cannot be empty unless an image is attached.',
    path: ['message'],
});


type ChatFormValues = z.infer<typeof chatFormSchema>;

const initialMessage: ChatMessageType = {
  id: 'initial-message',
  sender: 'ai',
  text: "Hello! I'm CyGuard. Paste a suspicious message, link, or attach a screenshot below.\n\nYour conversation is stored locally in your browser for your convenience. You can clear the history at any time using the trash icon.",
  isLoading: false,
};

const ChatInterface: FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([initialMessage]);
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting, errors }, watch, setValue } = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
  });

  const imageFile = watch('image');
  const { ref: imageInputRef, ...restImageInput } = register('image');


  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('cyguard-chat-history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setMessages(parsedHistory);
        }
      }
    } catch (error) {
        console.error("Could not load chat history from localStorage", error);
        // If parsing fails, start with a fresh chat
        setMessages([initialMessage]);
    }
  }, []);

  // Save history to localStorage on change
  useEffect(() => {
    try {
        // We only save if there's more than the initial message.
        if (messages.length > 1) {
            // Filter out any loading messages before saving
            const historyToSave = messages.filter(m => !m.isLoading);
            localStorage.setItem('cyguard-chat-history', JSON.stringify(historyToSave));
        } else {
            // If only the initial message is left, clear storage
            localStorage.removeItem('cyguard-chat-history');
        }
    } catch (error) {
        console.error("Could not save chat history to localStorage", error);
        toast({
            title: "Storage Error",
            description: "Could not save chat history to your browser's local storage.",
            variant: "destructive"
        });
    }
  }, [messages, toast]);


  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

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
    if(errors.image){
        toast({ title: "Image Error", description: errors.image.message as string, variant: "destructive" });
    }
  }, [errors.message, errors.image, toast]);

  const handleClearHistory = () => {
    setMessages([initialMessage]);
    localStorage.removeItem('cyguard-chat-history');
    toast({
        title: "Chat History Cleared",
        description: "Your conversation has been removed from your local device."
    });
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onSubmit: SubmitHandler<ChatFormValues> = async (data) => {
    const userMessageId = uuidv4();
    let imageAsDataUrl: string | undefined = undefined;
    
    if (data.image && data.image.length > 0) {
        imageAsDataUrl = await fileToBase64(data.image[0]);
    }

    const userMessage: ChatMessageType = {
      id: userMessageId,
      sender: 'user',
      text: data.message ?? "",
      image: imageAsDataUrl,
      isLoading: false,
    };

    const aiThinkingMessageId = uuidv4();
    const aiThinkingMessage: ChatMessageType = {
      id: aiThinkingMessageId,
      sender: 'ai',
      text: '', 
      isLoading: true,
    };
    
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages.concat(aiThinkingMessage));
    reset();
    if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
    setImagePreview(null);


    const history = currentMessages
      .filter(m => !m.isLoading && !m.screenshotAnalysis)
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

    const result = await handleUserMessage(aiThinkingMessageId, data.message ?? "", history, imageAsDataUrl);

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
    <div className="flex flex-col h-full bg-transparent">
        <div className="flex-shrink-0 flex items-center justify-between p-2 border-b">
            <h2 className="text-lg font-semibold">CyGuard Chat</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={messages.length <= 1}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your chat history from this browser. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory}>
                    Yes, delete history
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      <ScrollArea className="flex-grow px-1 md:px-2" ref={scrollViewportRef}>
        <div className="space-y-1 pb-4 pt-4">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-border p-3 md:p-4 bg-card/50 backdrop-blur-sm shadow- ऊपर">
        {imagePreview && (
          <div className="relative w-fit mb-2 p-2 border rounded-md bg-muted">
            <Image src={imagePreview} alt="Image preview" width={80} height={80} className="rounded-md object-cover" />
            <Button
              size="icon"
              variant="ghost"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
              onClick={() => {
                setValue('image', undefined);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 md:gap-3">
          <Input
            {...register('message')}
            placeholder="Paste text or attach a screenshot..."
            className="flex-grow text-sm bg-background/70 focus:bg-background"
            autoComplete="off"
            disabled={isSubmitting}
          />
          <input
            type="file"
            {...restImageInput}
            ref={(e) => {
              imageInputRef(e);
              fileInputRef.current = e;
            }}
            className="hidden"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            disabled={isSubmitting}
          />
          <Button 
            type="button" 
            size="icon" 
            variant="outline"
            disabled={isSubmitting} 
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach screenshot"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button type="submit" size="icon" disabled={isSubmitting} aria-label="Send message" className="shrink-0">
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;


    