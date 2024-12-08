"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useRecipes } from "@/hooks/useRecipes";

const AnimatedText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "0.5rem" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

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
    <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-[1400px] mx-auto px-4">
          <motion.div className="w-full">
            <AnimatedText 
              text="Share and discover amazing recipes"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent"
              delay={0.2}
            />
            
            <AnimatedText 
              text="Join our community of food lovers"
              className="mt-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground"
              delay={0.7}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.5 }}
              className="flex items-center justify-center space-x-6 mt-12"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-800 h-11"
                onClick={handleShareClick}
              >
                Create Recipe
              </Button>
              <Link href="/explore">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-foreground border-foreground hover:bg-foreground/10 h-11"
                >
                  Explore Recipes
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

      <main className="flex flex-col items-center min-h-screen pt-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </div>
  );
}