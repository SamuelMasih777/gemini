import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex gap-3 max-w-4xl mr-auto", className)}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-chat-ai text-chat-ai-foreground flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4" />
      </div>

      {/* Typing Animation */}
      <div className="flex flex-col gap-1">
        <div className="bg-chat-ai text-chat-ai-foreground px-4 py-3 rounded-2xl rounded-bl-md shadow-soft">
          <div className="flex items-center gap-1">
            <span className="text-sm">Gemini is typing</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}