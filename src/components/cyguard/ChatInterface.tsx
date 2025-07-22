
'use client';

import type { FC } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessageItem from './ChatMessageItem';
import { handleUserMessage } from '@/app/actions';
import { SendHorizontal, Paperclip, X, PlusSquare } from 'lucide-react';
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
import type { ClientMessage } from '@/app/actions';
import { useChatHistory } from '@/contexts/ChatHistoryContext';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';


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


const ChatInterface: FC = () => {
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [chatTitle, setChatTitle] = useState('');

  const {
    activeChat,
    setActiveChat,
    startNewChat,
    saveCurrentChat,
  } = useChatHistory();

  const { register, handleSubmit, reset, formState: { isSubmitting, errors }, watch, setValue } = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
  });

  const imageFile = watch('image');
  const { ref: imageInputRef, ...restImageInput } = register('image');

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
  }, [activeChat.messages]);
  
  useEffect(() => {
    if (errors.message) {
      toast({ title: "Input Error", description: errors.message.message, variant: "destructive" });
    }
    if(errors.image){
        toast({ title: "Image Error", description: errors.image.message as string, variant: "destructive" });
    }
  }, [errors.message, errors.image, toast]);


  const handleStartNewChat = () => {
    reset();
    setImagePreview(null);
    startNewChat();
  };
  
  const handleSaveChat = () => {
    const defaultTitle = activeChat.messages.find(m => m.sender === 'user')?.text.substring(0, 30) || `Chat - ${new Date().toLocaleString()}`;
    const finalTitle = chatTitle.trim() || defaultTitle;
    saveCurrentChat(finalTitle);
    setChatTitle('');
    setSaveDialogOpen(false);
    toast({
      title: "Chat Saved",
      description: `Your conversation "${finalTitle}" has been saved.`
    });
  }

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

    const userMessage: ClientMessage = {
      id: userMessageId,
      sender: 'user',
      text: data.message ?? "",
      image: imageAsDataUrl,
      isLoading: false,
    };

    const aiThinkingMessageId = uuidv4();
    const aiThinkingMessage: ClientMessage = {
      id: aiThinkingMessageId,
      sender: 'ai',
      text: '', 
      isLoading: true,
    };
    
    const currentMessages = [...activeChat.messages, userMessage];
    setActiveChat({ ...activeChat, messages: currentMessages.concat(aiThinkingMessage) });
    reset();
    if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
    setImagePreview(null);


    const history = currentMessages
      .filter(m => !m.isLoading && !m.screenshotAnalysis && m.id !== 'initial-message')
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
      setActiveChat(prev => ({ ...prev, messages: prev.messages.filter(msg => msg.id !== aiThinkingMessageId) })); 
    } else {
      setActiveChat(prev => ({
        ...prev,
        messages: prev.messages.map(msg => msg.id === aiThinkingMessageId ? { ...result, id: aiThinkingMessageId } : msg),
      }));
    }
  };

  const isChatPristine = activeChat.messages.length <= 1 && activeChat.messages[0]?.id === 'initial-message';

  return (
    <div className="flex flex-col h-full bg-transparent">
        <div className="flex-shrink-0 flex items-center justify-between p-2 border-b gap-2">
            <h2 className="text-lg font-semibold">{activeChat.title}</h2>
            <div className="flex items-center gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isChatPristine}>
                        <PlusSquare className="mr-2 h-4 w-4" />
                        New Chat
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Start a New Chat?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Any unsaved changes in the current chat will be lost. Would you like to save this conversation before starting a new one?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                       <AlertDialogAction onClick={() => {
                        setSaveDialogOpen(true);
                      }}>
                         Save First
                       </AlertDialogAction>
                      <AlertDialogAction onClick={handleStartNewChat}>
                        Start New
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Dialog open={isSaveDialogOpen} onOpenChange={setSaveDialogOpen}>
                   <DialogTrigger asChild>
                     <Button size="sm" disabled={isChatPristine}>Save Chat</Button>
                   </DialogTrigger>
                   <DialogContent>
                     <DialogHeader>
                       <DialogTitle>Save Chat</DialogTitle>
                     </DialogHeader>
                     <div className="grid gap-4 py-4">
                        <Label htmlFor="chat-title">Chat Title</Label>
                        <Input 
                          id="chat-title"
                          value={chatTitle}
                          onChange={(e) => setChatTitle(e.target.value)}
                          placeholder="Enter a title for this conversation..."
                        />
                     </div>
                     <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSaveChat}>Save</Button>
                     </DialogFooter>
                   </DialogContent>
                </Dialog>
            </div>
        </div>
      <ScrollArea className="flex-grow px-1 md:px-2" ref={scrollViewportRef}>
        <div className="space-y-1 pb-4 pt-4">
          {activeChat.messages.map((msg) => (
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
              if(e) {
                fileInputRef.current = e;
              }
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
