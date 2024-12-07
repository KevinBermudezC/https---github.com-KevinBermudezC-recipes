import { databases, storage, ID } from '@/lib/appwrite';
import { Recipe } from '@/types/recipe';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

export const RecipeService = {
  // Crear una receta
  createRecipe: async (recipe: Omit<Recipe, '$id' | '$createdAt'>) => {
    return await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      recipe
    );
  },

  // Obtener todas las recetas
  getAllRecipes: async () => {
    const response = await databases.listDocuments(
      databaseId,
      collectionId
    );
    return response.documents;
  },

  // Obtener una receta por ID
  getRecipe: async (id: string) => {
    return await databases.getDocument(
      databaseId,
      collectionId,
      id
    );
  },

  // Obtener recetas por usuario
  getUserRecipes: async (userId: string) => {
    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        databases.createQuery().equal('userId', userId)
      ]
    );
    return response.documents;
  },

  // Actualizar una receta
  updateRecipe: async (id: string, recipe: Partial<Recipe>) => {
    return await databases.updateDocument(
      databaseId,
      collectionId,
      id,
      recipe
    );
  },

  // Eliminar una receta
  deleteRecipe: async (id: string) => {
    return await databases.deleteDocument(
      databaseId,
      collectionId,
      id
    );
  },

  // Buscar recetas
  searchRecipes: async (query: string) => {
    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        databases.createQuery().search('title', query)
      ]
    );
    return response.documents;
  }
}; 