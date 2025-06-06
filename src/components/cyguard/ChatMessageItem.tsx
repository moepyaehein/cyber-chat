import type { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { BotMessageSquare, UserCircle2 } from 'lucide-react';
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

const ChatMessageItem: FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  const isSystem = message.sender === 'system';

  const Icon = isUser ? UserCircle2 : BotMessageSquare;

  if (isSystem) {
    return (
      <div className="text-center text-xs text-muted-foreground py-2 px-4">{message.text}</div>
    );
  }

  return (
    <div className={cn('flex items-start gap-3 my-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <BotMessageSquare className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <Card className={cn(
        'max-w-[75%] shadow-sm rounded-xl',
        isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card rounded-bl-none',
      )}>
        <CardContent className="p-3 text-sm">
          {message.isLoading ? (
            <LoadingDots />
          ) : (
            <>
              <p className="whitespace-pre-wrap">{message.text}</p>
              {isAI && message.threatAssessment && (
                <div className="mt-2 border-t border-border pt-2">
                  <ThreatLevelIndicator level={message.threatAssessment.threatLevel} />
                  <ActionStepsList steps={message.threatAssessment.actionSteps} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <UserCircle2 className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessageItem;
