import { Client, Account, Databases, Storage, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function createGuestSession() {
  try {
    // Primero verificamos si ya existe una sesión
    try {
      await account.getSession('current');
      // Si no hay error, significa que ya hay una sesión activa
      return;
    } catch {
      // Si hay error, significa que no hay sesión, entonces creamos una
      await account.createAnonymousSession();
    }
  } catch (error) {
    console.error('Error managing session:', error);
  }
}

// Llama a esto al inicio de tu app
createGuestSession();

export { ID };