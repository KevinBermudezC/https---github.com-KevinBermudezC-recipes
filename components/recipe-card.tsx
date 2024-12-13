import { Card } from "@/components/ui/card";
import { Recipe } from "@/types/recipe";
import { Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCookingTime } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  priority?: boolean;
}

export default function RecipeCard({ recipe, priority = false }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.$id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-primary/10">
        <div className="relative aspect-video">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold truncate text-foreground">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recipe.description}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatCookingTime(Number(recipe.time))}
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