import { databases, storage, ID } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Recipe } from '@/types/recipe';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

export const RecipeService = {
  // Obtener todas las recetas (público)
  getAllRecipes: async () => {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collectionId
      );
      return response.documents;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }
  },

  // Obtener una receta específica (público)
  getRecipe: async (id: string) => {
    try {
      return await databases.getDocument(
        databaseId,
        collectionId,
        id
      );
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return null;
    }
  },

  // Operaciones que requieren autenticación
  createRecipe: async (recipe: Omit<Recipe, '$id' | '$createdAt'>) => {
    return await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      recipe
    );
  },

  updateRecipe: async (id: string, recipe: Partial<Recipe>) => {
    return await databases.updateDocument(
      databaseId,
      collectionId,
      id,
      recipe
    );
  },

  deleteRecipe: async (id: string) => {
    return await databases.deleteDocument(
      databaseId,
      collectionId,
      id
    );
  },

  // Obtener recetas por usuario (requiere autenticación)
  getRecipesByUser: async (userId: string) => {
    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        Query.equal('userId', [userId])
      ]
    );
    return response.documents;
  },
}; 