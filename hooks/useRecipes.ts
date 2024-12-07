import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { RecipeService } from '@/lib/services/recipe.service';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await RecipeService.getAllRecipes();
      setRecipes(data);
    } catch (err) {
      setError('Error fetching recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const createRecipe = async (recipe: Omit<Recipe, '$id' | '$createdAt'>) => {
    try {
      const newRecipe = await RecipeService.createRecipe(recipe);
      setRecipes([...recipes, newRecipe]);
      return newRecipe;
    } catch (err) {
      setError('Error creating recipe');
      throw err;
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      await RecipeService.deleteRecipe(id);
      setRecipes(recipes.filter(recipe => recipe.$id !== id));
    } catch (err) {
      setError('Error deleting recipe');
      throw err;
    }
  };

  return {
    recipes,
    loading,
    error,
    createRecipe,
    deleteRecipe,
    refreshRecipes: fetchRecipes
  };
} 