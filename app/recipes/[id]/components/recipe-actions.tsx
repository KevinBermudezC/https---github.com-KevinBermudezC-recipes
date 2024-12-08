"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/lib/auth";
import { RecipeService } from "@/lib/services/recipe.service";
import { useRouter } from "next/navigation";
import { EditRecipeDialog } from "./edit-recipe-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";

interface Props {
  recipeId: string;
  userId: string;
  recipe: Recipe;
}

export function RecipeActions({ recipeId, userId, recipe }: Props) {
  const { user } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

  const isOwner = user?.$id === userId;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await RecipeService.deleteRecipe(recipeId);
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete recipe",
      });
    }
  };

  if (!isOwner) return null;

  return (
    <div className="flex items-center space-x-2">
      <EditRecipeDialog 
        recipe={recipe}
        onUpdate={() => router.refresh()}
      />
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
} 