"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useRecipes } from "@/hooks/useRecipes";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { recipes, loading } = useRecipes(false);

  const handleShareClick = () => {
    if (isAuthenticated) {
      router.push('/create-recipe');
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>

      <main className="flex flex-col items-center min-h-screen pt-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="flex min-h-[80vh] items-center justify-center">
            <div className="flex max-w-[64rem] flex-col items-center gap-6 text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                Share and discover amazing recipes
              </h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Join our community of food lovers and share your favorite recipes with the world
              </p>
              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-800"
                  onClick={handleShareClick}
                >
                  Create Recipe
                </Button>
                <Link href="/explore">
                  <Button variant="outline" size="lg">
                    Explore Recipes
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="py-20 w-full">
            <h2 className="text-3xl font-bold mb-12 text-center">Featured Recipes</h2>
            {loading ? (
              <div className="text-center">Loading recipes...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe) => (
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
          </section>
        </div>
      </main>
    </>
  );
}