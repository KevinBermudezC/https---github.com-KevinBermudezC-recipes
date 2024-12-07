"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/lib/auth';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Login() {
  const { loginWithGoogle, loginWithFacebook, loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithEmail(email, password);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-800">
            Sign in with Email
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={loginWithGoogle}
            type="button"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={loginWithFacebook}
            type="button"
          >
            <FaFacebook className="mr-2 h-5 w-5 text-blue-600" />
            Continue with Facebook
          </Button>
        </div>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </Card>
    </main>
  );
}