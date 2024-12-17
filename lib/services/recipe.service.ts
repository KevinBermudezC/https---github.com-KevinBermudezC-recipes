import { databases, storage, ID } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Recipe } from '@/types/recipe';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;
const favoritesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID!;

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
        Query.equal('users', [userId])
      ]
    );
    return response.documents;
  },

  async addFavorite(recipeId: string, userId: string) {
    return databases.createDocument(
      databaseId,
      favoritesCollectionId,
      ID.unique(),
      {
        userId,
        recipeId,
      }
    );
  },

  async removeFavorite(recipeId: string, userId: string) {
    const favorites = await databases.listDocuments(
      databaseId,
      favoritesCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('recipeId', recipeId),
      ]
    );

    if (favorites.documents.length > 0) {
      await databases.deleteDocument(
        databaseId,
        favoritesCollectionId,
        favorites.documents[0].$id
      );
    }
  },

  async isFavorite(recipeId: string, userId: string) {
    const favorites = await databases.listDocuments(
      databaseId,
      favoritesCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('recipeId', recipeId),
      ]
    );
    return favorites.documents.length > 0;
  },

  async getFavorites(userId: string) {
    const favorites = await databases.listDocuments(
      databaseId,
      favoritesCollectionId,
      [Query.equal('userId', userId)]
    );

    const recipes = await Promise.all(
      favorites.documents.map(async (fav) => {
        return this.getRecipe(fav.recipeId);
      })
    );

    return recipes.filter(Boolean);
  },
}; 