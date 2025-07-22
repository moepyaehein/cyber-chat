
import type { FC } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BotMessageSquare, UserCircle2, Terminal, ShieldQuestion, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClientMessage } from '@/app/actions';
import ThreatLevelIndicator from './ThreatLevelIndicator';
import ActionStepsList from './ActionStepsList';
import LoadingDots from './LoadingDots';
import { Badge } from '../ui/badge';

interface ChatMessageItemProps {
  message: ClientMessage;
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

interface BoldBlock {
  type: 'bold';
  content: string;
}

type ParsedContent = (TextBlock | CodeBlock | BoldBlock)[];

// Enhanced parser for ```code blocks``` and **bold text**
function parseMessageText(text: string): ParsedContent {
    const parts: ParsedContent = [];
    let lastIndex = 0;
    // Regex to capture ```code blocks```, **bold text**, or plain text.
    const regex = /(```(\w*)\n([\s\S]*?)\n```|\*\*([^\*]+)\*\*)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Capture text before the match
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
        }

        // Check if it's a code block
        if (match[1].startsWith('```')) {
            parts.push({
                type: 'code',
                language: match[2] || undefined,
                content: match[3].trim(),
            });
        }
        // Check if it's bold text
        else if (match[1].startsWith('**')) {
            parts.push({ type: 'bold', content: match[4] });
        }
        
        lastIndex = match.index + match[0].length;
    }

    // Capture any remaining text after the last match
    if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    // If no matches were found at all, the whole message is plain text.
    if (parts.length === 0 && text.length > 0) {
        return [{ type: 'text', content: text }];
    }

    return parts;
}


const ChatMessageItem: FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  if (message.sender === 'system') { // Should not happen with ClientMessage, but as a fallback
    return (
      <div className="text-center text-xs text-muted-foreground py-2 px-4">{message.text}</div>
    );
  }
  
  const parsedContent = parseMessageText(message.text);
  
  const getRiskLevelVariant = (level: number) => {
    if (level > 7) return 'destructive';
    if (level > 4) return 'secondary';
    return 'default';
  };
  
  const getRiskLevelIcon = (level: number) => {
     if (level > 7) return <AlertTriangle className="h-4 w-4 mr-1.5" />;
     if (level > 4) return <Info className="h-4 w-4 mr-1.5" />;
     return <CheckCircle className="h-4 w-4 mr-1.5" />;
  };

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
              {isUser && message.image && (
                 <div className="mb-2">
                    <Image src={message.image} alt="User upload" width={200} height={200} className="rounded-md object-contain" />
                 </div>
              )}
              <div className="whitespace-pre-wrap">
                {parsedContent.map((block, index) => {
                  if (block.type === 'text') {
                    return <span key={index}>{block.content}</span>;
                  }
                  if (block.type === 'bold') {
                    return <strong key={index}>{block.content}</strong>;
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
              </div>
              {isAI && message.threatAssessment && (
                <div className="mt-3 border-t border-border/70 pt-3 space-y-2">
                  <ThreatLevelIndicator level={message.threatAssessment.threatLevel} />
                  {message.threatAssessment.privacy_assessment && (
                     <div className="p-3 bg-accent/20 rounded-md shadow-sm">
                        <h4 className="font-semibold text-xs mb-1 flex items-center gap-1.5 text-accent-foreground/90">
                            <ShieldQuestion className="h-4 w-4 text-yellow-400" />
                            Privacy Note:
                        </h4>
                        <p className="text-xs text-secondary-foreground/80">{message.threatAssessment.privacy_assessment}</p>
                     </div>
                  )}
                  <ActionStepsList steps={message.threatAssessment.actionSteps} />
                </div>
              )}
               {isAI && message.screenshotAnalysis && (
                <div className="mt-3 border-t border-border/70 pt-3 space-y-3">
                    <Card>
                        <CardHeader className="p-3">
                            <CardTitle className="text-sm flex items-center justify-between">
                                Screenshot Analysis
                                <Badge variant={getRiskLevelVariant(message.screenshotAnalysis.riskScore)} className="text-xs px-2 py-0.5 capitalize">
                                  {getRiskLevelIcon(message.screenshotAnalysis.riskScore)}
                                  Risk: {message.screenshotAnalysis.riskScore}/10
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
                           {message.screenshotAnalysis.summary}
                        </CardContent>
                    </Card>

                   {message.screenshotAnalysis.redFlags && message.screenshotAnalysis.redFlags.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-xs mb-1.5 flex items-center gap-1.5 text-destructive">
                                <AlertTriangle className="h-4 w-4" /> Red Flags Identified
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                {message.screenshotAnalysis.redFlags.map((flag, index) => (
                                    <li key={index} className="break-words">{flag}</li>
                                ))}
                            </ul>
                        </div>
                   )}
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
