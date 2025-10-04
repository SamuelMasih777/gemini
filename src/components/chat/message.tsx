import { useState } from 'react';
import { Copy, Check, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Message as MessageType } from '@/store/chat-store';
import { toast } from 'sonner';

interface MessageProps {
  message: MessageType;
  className?: string;
}

export function Message({ message, className }: MessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={cn(
      "group flex gap-3 max-w-4xl",
      isUser ? "flex-row-reverse ml-auto" : "mr-auto",
      className
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isUser 
          ? "bg-chat-user text-chat-user-foreground" 
          : "bg-chat-ai text-chat-ai-foreground"
      )}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "relative px-4 py-3 rounded-2xl shadow-soft",
          isUser 
            ? "bg-chat-user text-chat-user-foreground rounded-br-md" 
            : "bg-chat-ai text-chat-ai-foreground rounded-bl-md"
        )}>
          {message.image && (
            <div className="mb-3">
              <img
                src={message.image}
                alt="Uploaded image"
                className="max-w-full h-auto rounded-lg max-h-60 object-cover"
              />
            </div>
          )}
          
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Copy Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={cn(
              "absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
              "bg-background border shadow-sm hover:bg-accent"
            )}
          >
            {copied ? (
              <Check className="w-3 h-3 text-success" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        </div>

        {/* Timestamp */}
        <span className={cn(
          "text-xs text-muted-foreground px-2",
          isUser ? "text-right" : "text-left"
        )}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}