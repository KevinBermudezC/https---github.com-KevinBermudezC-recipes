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
  const router = useRouter();
  const { toast } = useToast();

  const checkAuth = useCallback(async () => {
    try {
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
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await account.createEmailSession(email, password);
      
      const userData = await account.get();
      const session = await account.getSession('current');
      
      setUser({
        $id: userData.$id,
        name: userData.name,
        email: userData.email,
        emailVerification: userData.emailVerification,
        providerAccessToken: session.providerAccessToken,
        isAnonymous: false
      });

      router.refresh();
      return { success: true, user: userData };
    } catch (error: any) {
      // Manejar errores específicos
      if (error?.code === 401) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "An error occurred while logging in"
        });
      }
      setUser(null);
      return { success: false, error };
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

  const register = async (email: string, password: string, name: string) => {
    try {
      try {
        const currentUser = await account.get();
        if (currentUser) {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: "You are already logged in"
          });
          return { success: false };
        }
      } catch {}

      await account.create(ID.unique(), email, password, name);
      toast({
        title: "Registration successful",
        description: "Please login with your new account"
      });
      router.push('/login');
      return { success: true };
    } catch (error: any) {
      if (error?.code === 409) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Email already exists"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Please try again later"
        });
      }
      return { success: false, error };
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

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isLoading && !user.isAnonymous,
    loginWithEmail,
    loginWithGoogle,
    register,
    signOut: logout,
    requireAuth,
    updateProfile,
  };
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const authValue = useAuth();
  return React.createElement(AuthContext.Provider, { value: authValue }, children);
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}