"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Users, Plus, X } from "lucide-react";
import { useState } from "react";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export default function CreateRecipe() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: '', unit: '' }]);
  const [instructions, setInstructions] = useState<string[]>(['']);

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
            <form className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Recipe Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter the name of your recipe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
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
                        placeholder="e.g. 4"
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