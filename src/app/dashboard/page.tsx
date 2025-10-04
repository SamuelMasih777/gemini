"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/store/auth-store";
import { useChatStore } from "@/store/chat-store";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Plus, Search, Trash2, LogOut } from "lucide-react";
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
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { chatrooms, addChatroom, deleteChatroom, searchQuery, setSearchQuery, getFilteredChatrooms } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  const handleCreateChatroom = () => {
    const title = `Chat ${chatrooms.length + 1}`;
    const id = addChatroom(title);
    toast({
      title: "Chatroom Created",
      description: `"${title}" has been created successfully.`,
    });
    router.push(`/chat/${id}`);
  };

  const handleDeleteChatroom = (id: string) => {
    const chatroom = chatrooms.find(c => c.id === id);
    deleteChatroom(id);
    toast({
      title: "Chatroom Deleted",
      description: `"${chatroom?.title}" has been deleted.`,
    });
    setDeleteId(null);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/");
  };

  const filteredChatrooms = getFilteredChatrooms();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-chat p-4">
        <div className="container mx-auto max-w-4xl">
          <Skeleton className="h-16 w-full mb-6" />
          <Skeleton className="h-12 w-full mb-6" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-chat p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.countryCode} {user?.phoneNumber}
            </p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search chatrooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleCreateChatroom} className="bg-gradient-primary text-white hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {filteredChatrooms.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No chatrooms yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No chatrooms match your search." : "Create your first chatroom to get started."}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateChatroom} className="bg-gradient-primary text-white hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Chatroom
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredChatrooms.map((chatroom) => (
              <Card
                key={chatroom.id}
                className="hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => router.push(`/chat/${chatroom.id}`)}
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      {chatroom.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {chatroom.lastMessage || "No messages yet"}
                    </CardDescription>
                    {chatroom.lastMessageAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(chatroom.lastMessageAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(chatroom.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chatroom</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chatroom? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDeleteChatroom(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
