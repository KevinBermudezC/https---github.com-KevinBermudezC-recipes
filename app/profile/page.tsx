"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useRecipes } from "@/hooks/useRecipes";
import RecipeCard from "@/components/recipe-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Client, Avatars } from "appwrite";
import { EditProfileDialog } from "./components/edit-profile-dialog";

export default function ProfilePage() {
  const { user } = useAuth();
  const { recipes, loading } = useRecipes(true);

  const avatarUrl = user?.photoUrl || 
    `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/avatars/initials?name=${encodeURIComponent(user?.name || '')}`;

  if (!user) return null;

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-12">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-2xl">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-muted-foreground mb-6">{user.email}</p>
          <EditProfileDialog />
        </div>

        <Separator className="my-8" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
          <h2 className="text-2xl font-semibold text-foreground">My Recipes</h2>
          <Link href="/create-recipe">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-5 w-5 mr-2" />
              Create Recipe
            </Button>
          </Link>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="text-center">Loading recipes...</div>
        ) : recipes.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No recipes yet</h3>
            <p className="text-muted-foreground mb-4">
              Start sharing your favorite recipes with the community
            </p>
            <Link href="/create-recipe">
              <Button>Create Your First Recipe</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard 
                key={recipe.$id} 
                recipe={recipe}
                priority={index < 3}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 