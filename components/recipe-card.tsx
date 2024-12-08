import { Card } from "@/components/ui/card";
import { Recipe } from "@/types/recipe";
import { Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.$id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-video">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold truncate">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recipe.description}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {recipe.time}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {recipe.servings} servings
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 