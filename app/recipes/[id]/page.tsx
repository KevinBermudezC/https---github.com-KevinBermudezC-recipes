import { Card } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";
import Image from 'next/image';
import { RecipeActions } from "./components/recipe-actions";
import { RecipeService } from "@/lib/services/recipe.service";
import { Recipe } from "@/types/recipe";
import { formatCookingTime } from "@/lib/utils";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

async function getRecipe(id: string) {
  try {
    const recipeData = await RecipeService.getRecipe(id);
    if (!recipeData) return null;

    return {
      ...recipeData as unknown as Recipe,
      ingredients: JSON.parse(recipeData.ingredients),
      instructions: JSON.parse(recipeData.instructions)
    };
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

export default async function RecipePage({ params }: Props) {
  const resolvedParams = await params;
  const recipe = await getRecipe(resolvedParams.id);

  if (!recipe) {
    return <div className="container py-8 text-center">Recipe not found</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div className="w-full">
              <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
              <p className="mb-4">{recipe.description}</p>
              <div className="flex items-center gap-4 ">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{formatCookingTime(Number(recipe.time))}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
            </div>
            <div className="sm:ml-4">
              <RecipeActions 
                recipeId={recipe.$id ?? ''} 
                userId={recipe.userId ?? ''} 
                recipe={recipe} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient: Ingredient, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span>{ingredient.name}</span>
                    <span >
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="md:col-span-2 p-6">
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex">
                    <span className="font-bold mr-4">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}