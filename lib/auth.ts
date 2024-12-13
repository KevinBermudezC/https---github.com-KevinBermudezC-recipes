'use client';

import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ID } from 'appwrite';
import React from 'react';

interface AppwriteError {
  code: number;
  message: string;
}

interface User {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  photoUrl?: string;
  providerAccessToken?: string;
  isAnonymous?: boolean;
}

interface UpdateProfileData {
  name: string;
}

const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  const checkAuth = useCallback(async () => {
    try {
      const now = Date.now();
      if (now - lastCheck < 5000) {
        return;
      }
      setLastCheck(now);

      const session = await account.getSession('current');
      const userData = await account.get();
      
      setUser({
        $id: userData.$id,
        name: userData.name,
        email: userData.email,
        emailVerification: userData.emailVerification,
        providerAccessToken: session.providerAccessToken,
        isAnonymous: false
      });
      setIsLoading(false);
    } catch (error: any) {
      if (error?.code === 429) {
        setTimeout(checkAuth, 5000);
        return;
      }
      setUser(null);
      setIsLoading(false);
    }
  }, [lastCheck]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      try {
        await account.deleteSession('current');
      } catch {}

      await delay(1000);
      await account.createEmailSession(email, password);
      await checkAuth();
      router.push('/');
    } catch (error: any) {
      console.error('Email login error:', error);
      if (error?.code === 429) {
        toast({
          variant: "destructive",
          title: "Too many attempts",
          description: "Please wait a moment before trying again"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password"
        });
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      try {
        const currentSession = await account.getSession('current');
        if (currentSession) {
          await account.deleteSession('current');
        }
      } catch {}

      await account.createOAuth2Session(
        'google',
        `${window.location.origin}/`,
        `${window.location.origin}/login`
      );
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to login with Google"
      });
    }
  };

  const loginWithFacebook = async () => {
    try {
      try {
        await account.deleteSession('current');
      } catch {
      }

      await account.createOAuth2Session(
        'facebook',
        `${window.location.origin}/`,
        `${window.location.origin}/login`
      );
    } catch (error: any) {
      if (error?.code !== 409) {
        console.error('Facebook login error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to login with Facebook"
        });
      }
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      try {
        await account.get();
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "You are already logged in"
        });
        return;
      } catch {}

      await account.create(ID.unique(), email, password, name);
      toast({
        title: "Registration successful",
        description: "Please login with your new account"
      });
      router.push('/login');
    } catch (error: any) {
      if (error?.code === 409) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Email already exists"
        });
      } else {
        console.error('Registration error:', error);
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Please try again later"
        });
      }
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await account.deleteSession('current');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requireAuth = useCallback(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      await account.updateName(data.name);
      await checkAuth();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isLoading && !user.isAnonymous,
    loginWithEmail,
    loginWithGoogle,
    loginWithFacebook,
    register,
    signOut: logout,
    requireAuth,
    updateProfile,
  };
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const auth = useAuth();
  return React.createElement(AuthContext.Provider, { value: auth }, children);
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}