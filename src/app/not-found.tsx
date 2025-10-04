"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-chat">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you@apos;re looking for doesn@apos;t exist or has been moved.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/")} 
          className="bg-gradient-primary text-white hover:opacity-90 transition-opacity"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
