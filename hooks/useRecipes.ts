import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '@/types/recipe';
import { RecipeService } from '@/lib/services/recipe.service';
import { useAuth } from '@/lib/auth';

export function useRecipes(requireAuth: boolean = false) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      if (requireAuth && user) {
        data = await RecipeService.getRecipesByUser(user.$id);
      } else {
        data = await RecipeService.getAllRecipes();
      }
      setRecipes(data.map(doc => ({
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        title: doc.title,
        description: doc.description,
        time: doc.time,
        servings: doc.servings,
        ingredients: doc.ingredients,
        instructions: doc.instructions,
        image: doc.image,
        userId: doc.userId
      })));
    } catch (err) {
      setError('Error fetching recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, requireAuth]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    refreshRecipes: fetchRecipes
  };
} 