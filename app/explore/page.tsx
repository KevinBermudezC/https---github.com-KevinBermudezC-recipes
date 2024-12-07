"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, Users, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRecipes } from "@/hooks/useRecipes";
import { useState } from "react";

export default function Explore() {
  const { recipes, loading } = useRecipes();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex flex-col items-center min-h-screen pt-24">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Explore Recipes</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search recipes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center">Loading recipes...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <Link href={`/recipes/${recipe.$id}`} key={recipe.$id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/50 dark:bg-black/50">
                    <div className="aspect-video relative">
                      <Image
                        src={recipe.image}
                        alt={recipe.title}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={true}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                      <p className="text-muted-foreground mb-4">{recipe.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 