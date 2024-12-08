"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Recipe, Ingredient } from "@/types/recipe";
import { useState } from "react";
import { RecipeService } from "@/lib/services/recipe.service";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, X, ImagePlus } from "lucide-react";
import { storage } from '@/lib/appwrite';
import { ID } from 'appwrite';
import Image from "next/image";

interface Props {
  recipe: Recipe;
  onUpdate: () => void;
}

export function EditRecipeDialog({ recipe, onUpdate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: recipe.title,
    description: recipe.description,
    time: recipe.time,
    servings: recipe.servings,
    ingredients: typeof recipe.ingredients === 'string' 
      ? JSON.parse(recipe.ingredients) 
      : recipe.ingredients,
    instructions: typeof recipe.instructions === 'string' 
      ? JSON.parse(recipe.instructions) 
      : recipe.instructions
  });
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(recipe.image);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // Crear URL de vista previa
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageFile(file);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load image",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = recipe.image;

      // Subir nueva imagen si se seleccionó una
      if (imageFile) {
        const uploadedFile = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
          ID.unique(),
          imageFile
        );
        imageUrl = storage.getFileView(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
          uploadedFile.$id
        ).href;
      }

      await RecipeService.updateRecipe(recipe.$id!, {
        ...formData,
        image: imageUrl,
        ingredients: typeof formData.ingredients === 'string' 
          ? formData.ingredients 
          : JSON.stringify(formData.ingredients),
        instructions: typeof formData.instructions === 'string' 
          ? formData.instructions 
          : JSON.stringify(formData.instructions)
      });

      toast({
        title: "Success",
        description: "Recipe updated successfully",
      });
      setIsOpen(false);
      onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update recipe",
      });
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", amount: "", unit: "" }]
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ""]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_: Ingredient, i: number) => i !== index)
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_: string, i: number) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Recipe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Time</label>
                <Input
                  value={formData.time}
                  onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Servings</label>
                <Input
                  type="number"
                  value={formData.servings}
                  onChange={e => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Ingredients</label>
              {formData.ingredients.map((ingredient: Ingredient, index: number) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <Input
                      placeholder="Name"
                      value={ingredient.name}
                      onChange={e => {
                        const newIngredients = [...formData.ingredients];
                        newIngredients[index].name = e.target.value;
                        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                      }}
                    />
                    <Input
                      placeholder="Amount"
                      value={ingredient.amount}
                      onChange={e => {
                        const newIngredients = [...formData.ingredients];
                        newIngredients[index].amount = e.target.value;
                        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                      }}
                    />
                    <Input
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={e => {
                        const newIngredients = [...formData.ingredients];
                        newIngredients[index].unit = e.target.value;
                        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                onClick={addIngredient} 
                className="mt-2"
              >
                Add Ingredient
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium">Instructions</label>
              {formData.instructions.map((instruction: string, index: number) => (
                <div key={index} className="flex items-start gap-2 mt-2">
                  <div className="flex-1">
                    <Textarea
                      value={instruction}
                      onChange={e => {
                        const newInstructions = [...formData.instructions];
                        newInstructions[index] = e.target.value;
                        setFormData(prev => ({ ...prev, instructions: newInstructions }));
                      }}
                      placeholder={`Step ${index + 1}`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInstruction(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                onClick={addInstruction} 
                className="mt-2"
              >
                Add Step
              </Button>
            </div>
          </div>
            <div>
              <label className="text-sm font-medium">Image</label>
              <div className="mt-2 space-y-2">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={imagePreview}
                    alt="Recipe preview"
                    className="object-cover w-full h-full"
                    width={500}
                    height={500}
                  />
                  <label className="absolute bottom-2 right-2">
                    <div className="bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm h-9 px-4">
                      <ImagePlus className="mr-2 h-4 w-4" />
                      Change Image
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 