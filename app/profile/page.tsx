"use client";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRecipes } from "@/hooks/useRecipes";
import { Recipe } from "@/types/recipe";
import { Pencil } from "lucide-react";
import { account } from "@/lib/appwrite";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import RecipeCard from "@/components/recipe-card";

export default function ProfilePage() {
  const { user, requireAuth } = useAuth();
  const { recipes, loading } = useRecipes(true);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");

  // Filtrar recetas del usuario usando el email en lugar del ID
  const userRecipes = recipes.filter((recipe: Recipe) => recipe.userId === user?.$id);

  const handleUpdateName = async () => {
    try {
      await account.updateName(newName);
      toast({
        title: "Success",
        description: "Name updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update name",
      });
    }
  };

  if (!user) {
    requireAuth();
    return null;
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="p-6">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="relative flex justify-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage 
                    src={user.providerAccessToken ? `https://lh3.googleusercontent.com/a/${user.providerAccessToken}` : undefined} 
                    alt={user.name} 
                  />
                  <AvatarFallback className="text-2xl">
                    {user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2 text-center">
                {isEditing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="max-w-[200px]"
                    />
                    <Button onClick={handleUpdateName}>Save</Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">My Recipes</h3>
            <Link href="/create-recipe">
              <Button>Create Recipe</Button>
            </Link>
          </div>
          {userRecipes.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              You haven&apos;t created any recipes yet.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userRecipes.map((recipe: Recipe) => (
                <RecipeCard key={recipe.$id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 