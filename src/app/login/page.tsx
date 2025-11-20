'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import API from "@/lib/apiClient";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      // Save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      // Show toast + let it disappear before redirect
      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
        duration: 1500, // Toast disappears in 1.5 seconds
      });

      // Redirect AFTER toast disappears
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const backendMessage =
          err.response?.data?.message ||
          err.message ||
          "Login failed.";

        console.log("Login error:", backendMessage);

        toast({
          variant: "destructive",
          title: "Login Failed",
          description: backendMessage,
        });
      } else if (err instanceof Error) {
        console.log("Unexpected error:", err.message);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: err.message,
        });
      } else {
        console.log("Unknown error:", err);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "An unknown error occurred.",
        });
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image
                src="/kiwenda.png"
                alt="Kiwenda Logo"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          </div>
          <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@kiwenda.org"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Log in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
