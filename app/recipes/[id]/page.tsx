import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";
import { Metadata } from 'next';
import Image from 'next/image';
import { RecipeActions } from "./components/recipe-actions";

interface Props {
  params: {
    id: string;
  };
}

// Datos simulados - en un caso real, esto vendría de una API o base de datos
const getRecipe = async (id: string) => {
  return {
    title: "Paella Valenciana",
    image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=2070&auto=format&fit=crop",
    time: "45 min",
    servings: 4,
    description: "Auténtica paella valenciana con arroz, pollo, conejo y verduras.",
    author: "María García",
    ingredients: [
      { name: "Arroz bomba", quantity: "400", unit: "g" },
      { name: "Pollo", quantity: "500", unit: "g" },
      { name: "Judías verdes", quantity: "200", unit: "g" },
      { name: "Azafrán", quantity: "1", unit: "sobre" },
    ],
    instructions: [
      "Calentar el aceite en la paella y sofreír el pollo hasta que esté dorado.",
      "Añadir las verduras y cocinar por 5 minutos.",
      "Incorporar el arroz y el caldo caliente.",
      "Cocinar a fuego medio durante 18-20 minutos.",
    ],
  };
};

export async function generateStaticParams() {
  return [
    { id: '1' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = await getRecipe(params.id);
  return {
    title: `Receta: ${recipe.title}`,
    description: recipe.description,
  };
}

export default async function RecipePage({ params }: Props) {
  const recipe = await getRecipe(params.id);

  return (
    <div className="container py-8">
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

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
            <p className="text-muted-foreground mb-4">{recipe.description}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {recipe.time}
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {recipe.servings} porciones
              </div>
            </div>
          </div>
          <RecipeActions />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ingredientes</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex justify-between">
                  <span>{ingredient.name}</span>
                  <span className="text-muted-foreground">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Instrucciones</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
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
  );
}