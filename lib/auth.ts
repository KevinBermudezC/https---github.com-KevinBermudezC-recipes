import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await account.getSession('current');
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await account.createOAuth2Session(
        'google',
        `${window.location.origin}/create-recipe`,
        `${window.location.origin}/login`
      );
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  const loginWithFacebook = async () => {
    try {
      await account.createOAuth2Session(
        'facebook',
        'http://localhost:3000/create-recipe',
        'http://localhost:3000/login'
      );
    } catch (error) {
      console.error('Error logging in with Facebook:', error);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await account.createEmailSession(email, password);
      setIsAuthenticated(true);
      router.push('/create-recipe');
    } catch (error) {
      console.error('Error logging in with email:', error);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  };

  return { 
    isAuthenticated, 
    isLoading, 
    requireAuth, 
    loginWithGoogle, 
    loginWithFacebook,
    loginWithEmail,
    logout 
  };
}