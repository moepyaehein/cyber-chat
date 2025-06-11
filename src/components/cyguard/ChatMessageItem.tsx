import type { FC } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { BotMessageSquare, UserCircle2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssessThreatOutput } from '@/ai/flows/assess-threat';
import ThreatLevelIndicator from './ThreatLevelIndicator';
import ActionStepsList from './ActionStepsList';
import LoadingDots from './LoadingDots';

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  threatAssessment?: AssessThreatOutput;
  isLoading?: boolean;
}

interface ChatMessageItemProps {
  message: Message;
}

interface CodeBlock {
  type: 'code';
  language?: string;
  content: string;
}

interface TextBlock {
  type: 'text';
  content: string;
}

type ParsedContent = (TextBlock | CodeBlock)[];

// Basic parser for ```code blocks```
// This could be made more robust, e.g. to handle nested blocks or escaped backticks if needed.
function parseMessageText(text: string): ParsedContent {
  const parts: ParsedContent = [];
  let lastIndex = 0;
  const regex = /```(\w*)\n([\s\S]*?)\n```/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }
    parts.push({
      type: 'code',
      language: match[1] || undefined,
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex) });
  }
  
  if (parts.length === 0 && text.length > 0) {
    return [{ type: 'text', content: text }];
  }

  return parts;
}


const ChatMessageItem: FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  const isSystem = message.sender === 'system';

  if (isSystem) {
    return (
      <div className="text-center text-xs text-muted-foreground py-2 px-4">{message.text}</div>
    );
  }
  
  const parsedContent = isAI ? parseMessageText(message.text) : [{ type: 'text', content: message.text } as TextBlock];

  return (
    <div className={cn('flex items-start gap-3 my-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8 shadow-md">
          <AvatarFallback className="bg-primary/20">
            <BotMessageSquare className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <Card className={cn(
        'max-w-[85%] shadow-md rounded-xl',
        isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none',
      )}>
        <CardContent className="p-3 text-sm">
          {message.isLoading ? (
            <LoadingDots />
          ) : (
            <>
              {parsedContent.map((block, index) => {
                if (block.type === 'text') {
                  return <p key={index} className="whitespace-pre-wrap">{block.content}</p>;
                }
                if (block.type === 'code') {
                  return (
                    <div key={index} className="my-2 rounded-md bg-code-background text-code-foreground shadow-inner">
                      {block.language && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border text-xs text-muted-foreground">
                          <Terminal className="h-3.5 w-3.5" />
                          <span>{block.language}</span>
                        </div>
                      )}
                      <pre className="p-3 overflow-x-auto">
                        <code className="font-code text-xs">{block.content}</code>
                      </pre>
                    </div>
                  );
                }
                return null;
              })}
              {isAI && message.threatAssessment && (
                <div className="mt-3 border-t border-border/70 pt-3">
                  <ThreatLevelIndicator level={message.threatAssessment.threatLevel} />
                  <ActionStepsList steps={message.threatAssessment.actionSteps} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      {isUser && (
        <Avatar className="h-8 w-8 shadow-md">
          <AvatarFallback className="bg-muted">
            <UserCircle2 className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessageItem;
