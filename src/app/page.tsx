"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MessageSquare, Sparkles, Image, Shield, Zap, Moon } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: MessageSquare,
      title: "Smart Conversations",
      description: "Engage in intelligent conversations with AI-powered responses"
    },
    {
      icon: Sparkles,
      title: "Multiple Chatrooms",
      description: "Organize your conversations in separate chatrooms"
    },
    {
      icon: Image,
      title: "Image Support",
      description: "Share and discuss images within your chats"
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "OTP-based secure login with country code support"
    },
    {
      icon: Zap,
      title: "Real-time Responses",
      description: "Get instant AI responses with typing indicators"
    },
    {
      icon: Moon,
      title: "Dark Mode",
      description: "Comfortable viewing experience in any lighting"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block">
            <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Gemini Clone
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of AI conversations with our modern chat assistant
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => router.push("/auth")}
              className="bg-gradient-primary text-white hover:opacity-90 transition-opacity shadow-elegant"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/auth")}
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-primary text-white border-0">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Ready to start chatting?</h2>
              <p className="mb-6 opacity-90">
                Join thousands of users experiencing the power of AI-driven conversations
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/auth")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Create Your Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
