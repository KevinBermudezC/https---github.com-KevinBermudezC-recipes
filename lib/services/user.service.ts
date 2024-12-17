import { account, ID } from '@/lib/appwrite';
import { User } from '@/types/recipe';

export const UserService = {
  // Obtener usuario actual
  getCurrentUser: async (): Promise<User> => {
    return await account.get();
  },

  // Crear cuenta
  createAccount: async (email: string, password: string, name: string) => {
    return await account.create(ID.unique(), email, password, name);
  },

  // Actualizar nombre
  updateName: async (name: string) => {
    return await account.updateName(name);
  },

  // Actualizar email
  updateEmail: async (email: string, password: string) => {
    return await account.updateEmail(email, password);
  },

  // Actualizar contraseña
  updatePassword: async (password: string, oldPassword: string) => {
    return await account.updatePassword(password, oldPassword);
  }
}; 