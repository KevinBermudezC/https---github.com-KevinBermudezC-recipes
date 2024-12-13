"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { RecipeService } from "@/lib/services/recipe.service";
import RecipeCard from "@/components/recipe-card";
import { Recipe } from "@/types/recipe";

export default function FavoritesPage() {
  const { user, requireAuth } = useAuth();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requireAuth();
    const loadFavorites = async () => {
      if (user) {
        const favRecipes = await RecipeService.getFavorites(user.$id);
        setFavorites(favRecipes);
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user, requireAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">My Favorite Recipes</h1>
        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No favorite recipes yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((recipe, index) => (
              <RecipeCard 
                key={recipe.$id} 
                recipe={recipe}
                priority={index < 3}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 