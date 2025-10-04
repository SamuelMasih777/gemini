"use client";

import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/store/auth-store";
import { useChatStore } from "@/store/chat-store";
import { Message } from "@/components/chat/message";
import { MessageInput } from "@/components/chat/message-input";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { chatrooms, messages, addMessage, addAiMessage, setTyping, isTyping, deleteChatroom, loadMoreMessages } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);

  const chatroom = chatrooms.find((c) => c.id === id);
  const chatroomMessages = messages[id] || [];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    } else if (!chatroom) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, chatroom, router]);

  useEffect(() => {
    if (chatroomMessages.length > lastMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    lastMessageCountRef.current = chatroomMessages.length;
  }, [chatroomMessages.length]);

  const handleSendMessage = (content: string, image?: string) => {
    addMessage(id, content, image);
    
    setTyping(true);
    
    setTimeout(() => {
      const responses = [
        "That's an interesting point! Let me think about that.",
        "I understand what you're saying. Here's my perspective...",
        "Great question! Based on what you've shared...",
        "I can help you with that. Let me provide some insights.",
        "That's a fascinating topic. Here's what I think...",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addAiMessage(id, randomResponse);
      setTyping(false);
    }, 2000 + Math.random() * 2000);
  };

  const handleDeleteChatroom = () => {
    deleteChatroom(id);
    toast({
      title: "Chatroom Deleted",
      description: `"${chatroom?.title}" has been deleted.`,
    });
    router.push("/dashboard");
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || !hasMore) return;

    if (container.scrollTop === 0) {
      const previousHeight = container.scrollHeight;
      loadMoreMessages(id);
      
      setTimeout(() => {
        if (container.scrollHeight === previousHeight) {
          setHasMore(false);
        } else {
          container.scrollTop = container.scrollHeight - previousHeight;
        }
      }, 100);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-gradient-chat">
        <div className="border-b bg-card/50 backdrop-blur-sm p-4">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-chat">
      <div className="border-b bg-card/50 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">{chatroom?.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Chatroom</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{chatroom?.title}&quot;? This will permanently delete all messages.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteChatroom}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {hasMore && chatroomMessages.length > 0 && (
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={() => loadMoreMessages(id)}>
              Load more messages
            </Button>
          </div>
        )}
        
        {chatroomMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Start a conversation by sending a message below</p>
            </div>
          </div>
        ) : (
          chatroomMessages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-card/50 backdrop-blur-sm p-4">
        <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}
