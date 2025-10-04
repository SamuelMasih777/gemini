"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/auth/phone-input";
import { OtpInput } from "@/components/auth/otp-input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore, User } from "@/store/auth-store";
import { Country } from "@/components/auth/country-selector";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const phoneSchema = z.object({
  phone: z.string().min(7, "Phone number must be at least 7 digits").max(15, "Phone number is too long"),
  countryCode: z.string().min(1, "Please select a country"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function AuthPage() {
  const router = useRouter();
  const { login, setPendingAuth, setOtpSent, isOtpSent, pendingPhone, pendingCountryCode } = useAuthStore();
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
      countryCode: "",
    },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handlePhoneSubmit = async (data: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    setPendingAuth(data.phone, data.countryCode);

    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast({
        title: "OTP Sent!",
        description: `Verification code sent to ${data.countryCode} ${data.phone}. Use 123456 for demo.`,
      });
    }, 1500);
  };

  const handleOtpSubmit = async (data: z.infer<typeof otpSchema>) => {
    setIsLoading(true);

    setTimeout(() => {
      if (data.otp === "123456") {
        const user: User = {
          id: `user_${Date.now()}`,
          phoneNumber: pendingPhone,
          countryCode: pendingCountryCode,
          createdAt: new Date().toISOString(),
        };
        login(user);
        toast({
          title: "Welcome!",
          description: "Successfully logged in.",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please enter the correct OTP (123456 for demo)",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    setOtpSent(false);
    otpForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-chat p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            {isOtpSent && (
              <Button variant="ghost" size="icon" onClick={handleBack} disabled={isLoading}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
                {isOtpSent ? "Verify OTP" : "Welcome"}
              </CardTitle>
              <CardDescription>
                {isOtpSent
                  ? `Enter the code sent to ${pendingCountryCode} ${pendingPhone}`
                  : "Sign in with your phone number"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isOtpSent ? (
            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
              <PhoneInput
                value={phoneForm.watch("phone")}
                onChange={(value) => phoneForm.setValue("phone", value)}
                selectedCountry={selectedCountry}
                onCountryChange={(country) => {
                  setSelectedCountry(country);
                  phoneForm.setValue("countryCode", country.dialCode);
                }}
                error={phoneForm.formState.errors.phone?.message}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-primary text-white hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
              <OtpInput
                value={otpForm.watch("otp")}
                onChange={(value) => otpForm.setValue("otp", value)}
                error={otpForm.formState.errors.otp?.message}
              />
              <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
                💡 Demo OTP: <span className="font-mono font-semibold">123456</span>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-primary text-white hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
