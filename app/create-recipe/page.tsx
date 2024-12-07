"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Users, Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { databases, account, ID, storage } from "@/lib/appwrite";
import { useState, FormEvent, useEffect } from "react";
import { useAuth } from '@/lib/auth';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface RecipeData {
  title: string;
  description: string;
  time: string;
  servings: number;
  ingredients: string;
  instructions: string;
  image: string;
  userId: string;
}

// Schema de validación
const recipeSchema = z.object({
  title: z.string().min(3, "Recipe title should be at least 3 characters long"),
  description: z.string().min(10, "Please provide a more detailed description of your recipe"),
  time: z.string().min(1, "How long does it take to prepare this recipe?"),
  servings: z.number().min(1, "Please specify how many people this recipe serves"),
  ingredients: z.array(z.object({
    name: z.string().min(1, "What ingredient are you using?"),
    amount: z.string().min(1, "How much do you need?"),
    unit: z.string().min(1, "What unit of measurement?"),
  })).min(1, "Add at least one ingredient to your recipe"),
  instructions: z.array(z.string().min(1, "This step is empty"))
    .min(1, "How do you prepare it? Add at least one step"),
});

export default function CreateRecipe() {
  const { requireAuth, isLoading } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: '', unit: '' }]);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [servings, setServings] = useState<number>(2);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    try {
      // Validar título
      if (!title || title.length < 3) {
        toast.error("Invalid title", {
          description: "Recipe title should be at least 3 characters long"
        });
        return false;
      }

      // Validar descripción
      if (!description || description.length < 10) {
        toast.error("Invalid description", {
          description: "Please provide a more detailed description of your recipe"
        });
        return false;
      }

      // Validar tiempo
      if (!time) {
        toast.error("Missing cooking time", {
          description: "How long does it take to prepare this recipe?"
        });
        return false;
      }

      // Validar porciones
      if (!servings || servings < 1) {
        toast.error("Invalid servings", {
          description: "Please specify how many people this recipe serves"
        });
        return false;
      }

      // Validar ingredientes
      if (ingredients.length === 0) {
        toast.error("No ingredients", {
          description: "Add at least one ingredient to your recipe"
        });
        return false;
      }

      // Validar que cada ingrediente esté completo
      const invalidIngredient = ingredients.find(ing => !ing.name || !ing.amount || !ing.unit);
      if (invalidIngredient) {
        toast.error("Incomplete ingredient", {
          description: "Please fill in all fields for each ingredient"
        });
        return false;
      }

      // Validar instrucciones
      const validInstructions = instructions.filter(i => i.trim() !== '');
      if (validInstructions.length === 0) {
        toast.error("No instructions", {
          description: "How do you prepare it? Add at least one step"
        });
        return false;
      }

      // Validar que haya una imagen
      if (!imageFile) {
        toast.error("Image required", {
          description: "Please upload an image for your recipe"
        });
        return false;
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Please select an image under 5MB"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const loadingToast = toast.loading('Saving your recipe...');
    
    try {
      setUploading(true);
      const user = await account.get();
      
      let imageUrl = '';
      if (imageFile) {
        // Crear el archivo
        const file = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
          ID.unique(),
          imageFile
        );

        // Obtener la URL de la imagen usando el método de Appwrite
        imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      }

      const recipeData: RecipeData = {
        title,
        description,
        time,
        servings,
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify(instructions.filter(i => i.trim() !== '')),
        image: imageUrl,
        userId: user.$id,
      };

      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
        ID.unique(),
        recipeData
      );
      
      toast.success('Recipe published successfully!', {
        description: "Others can now enjoy your creation"
      });
      router.push(`/recipes/${response.$id}`);
    } catch (error) {
      toast.error('Could not save your recipe', {
        description: "Please try again. If the problem persists, contact support"
      });
      console.error('Error:', error);
    } finally {
      setUploading(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen pt-24">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Create Recipe</h1>
            <p className="text-muted-foreground">
              Share your favorite recipe with the community
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Recipe Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter the name of your recipe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your recipe in a few sentences"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Cooking Time</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="e.g. 45 minutes"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="servings">Servings</Label>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="servings"
                        type="number"
                        value={servings}
                        onChange={(e) => setServings(Number(e.target.value))}
                        placeholder="e.g. 4"
                        min={1}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ingredients</Label>
                  <div className="space-y-4">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-[3] space-y-1">
                          <Input
                            placeholder="Ingredient name (e.g. Flour)"
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Input
                              className="flex-1"
                              placeholder="Amount (e.g. 500)"
                              value={ingredient.amount}
                              onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                            />
                            <Input
                              className="flex-1"
                              placeholder="Unit (e.g. g)"
                              value={ingredient.unit}
                              onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                            />
                          </div>
                        </div>
                        {ingredients.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="mt-1"
                            onClick={() => removeIngredient(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={addIngredient}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <div className="space-y-4">
                    {instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-none pt-3 text-muted-foreground">
                          {index + 1}.
                        </div>
                        <Textarea
                          placeholder="Enter step instruction"
                          className="flex-1"
                          value={instruction}
                          onChange={(e) => updateInstruction(index, e.target.value)}
                        />
                        {instructions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInstruction(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={addInstruction}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Recipe Image</Label>
                  <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors">
                    {imagePreview ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Recipe preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-2 cursor-pointer">
                        <div className="p-4 rounded-full bg-muted">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or WEBP (max. 5MB)
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline">Cancel</Button>
                <Button type="submit" className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-800">
                  Create Recipe
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
} 