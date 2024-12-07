import { account } from './appwrite';
import { ID } from 'appwrite';

export async function signUp(email: string, password: string, name: string) {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    return user;
  } catch (error) {
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
  try {
    await account.deleteSession('current');
  } catch (error) {
    throw error;
  }
}