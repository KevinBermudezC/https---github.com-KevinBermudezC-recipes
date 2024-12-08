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
  providerAccessToken?: string;
  isAnonymous?: boolean;
}

const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const checkAuth = useCallback(async () => {
    try {
      let session;
      try {
        session = await account.getSession('current');
      } catch {
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (!session || session.provider === 'anonymous') {
        setUser(null);
        // Limpiar cualquier sesión anónima
        try {
          await account.deleteSession('current');
        } catch {}
        setIsLoading(false);
        return;
      }

      const userData = await account.get();
      
      // Solo aceptar usuarios verificados o de OAuth
      if (userData.emailVerification || session.provider === 'google' || session.provider === 'facebook') {
        setUser({
          $id: userData.$id,
          name: userData.name,
          email: userData.email,
          emailVerification: userData.emailVerification,
          providerAccessToken: session.providerAccessToken,
          isAnonymous: false
        });
      } else {
        setUser(null);
        await account.deleteSession('current');
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await account.createEmailSession(email, password);
      await checkAuth();
      router.push('/');
    } catch (error) {
      console.error('Email login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password"
      });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await account.createOAuth2Session(
        'google',
        `${window.location.origin}/`,
        `${window.location.origin}/login`
      );
    } catch (error: any) {
      if (error?.code !== 409) {
        console.error('Google login error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to login with Google"
        });
      }
    }
  };

  const loginWithFacebook = async () => {
    try {
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

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isLoading && !user.isAnonymous,
    loginWithEmail,
    loginWithGoogle,
    loginWithFacebook,
    register,
    signOut: logout,
    requireAuth
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