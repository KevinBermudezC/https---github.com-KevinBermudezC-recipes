"use client";

import { Button } from "@/components/ui/button";
import { Heart, Share2, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { RecipeService } from "@/lib/services/recipe.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RecipeActionsProps {
  recipeId?: string;
  userId?: string;
}

export function RecipeActions({ recipeId, userId }: RecipeActionsProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleDelete = async () => {
    if (!recipeId) return;
    
    try {
      await RecipeService.deleteRecipe(recipeId);
      toast.success("Recipe deleted successfully");
      router.push("/explore");
    } catch (error) {
      toast.error("Failed to delete recipe");
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon">
        <Heart className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon">
        <Share2 className="h-5 w-5" />
      </Button>
      {isAuthenticated && (
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
} 