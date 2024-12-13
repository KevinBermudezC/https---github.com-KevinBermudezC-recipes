"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/lib/auth";
import { RecipeService } from "@/lib/services/recipe.service";
import { useRouter } from "next/navigation";
import { EditRecipeDialog } from "./edit-recipe-dialog";
import { toast } from "sonner";
import { Recipe } from "@/types/recipe";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  recipeId: string;
  userId: string;
  recipe: Recipe;
}

export function RecipeActions({ recipeId, userId, recipe }: Props) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const isOwner = user?.$id === userId;

  useEffect(() => {
    const checkFavorite = async () => {
      if (user) {
        const isFav = await RecipeService.isFavorite(recipeId, user.$id);
        setIsFavorite(isFav);
      }
    };
    checkFavorite();
  }, [recipeId, user]);

  const handleFavorite = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (isFavorite) {
        await RecipeService.removeFavorite(recipeId, user.$id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await RecipeService.addFavorite(recipeId, user.$id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="bg-background border rounded-lg shadow-lg p-6 max-w-md">
        <h3 className="font-semibold mb-2">Delete Recipe?</h3>
        <p className="mb-4">
          Are you sure you want to delete this recipe? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => toast.dismiss(t)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={() => {
              toast.promise(
                () => RecipeService.deleteRecipe(recipeId),
                {
                  loading: 'Deleting recipe...',
                  success: () => {
                    router.push("/");
                    return 'Recipe deleted successfully';
                  },
                  error: 'Failed to delete recipe'
                }
              );
              toast.dismiss(t);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleFavorite}
        className={isFavorite ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
      </Button>
      {isOwner && (
        <>
          <EditRecipeDialog 
            recipe={recipe}
            onUpdate={() => router.refresh()}
          />
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </>
      )}
    </div>
  );
} 