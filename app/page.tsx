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
      <div className="flex flex-col items-center justify-center min-h-screen text-center max-w-[1400px] mx-auto px-4">
        <motion.div className="w-full">
          <AnimatedText 
            text="Share and discover amazing recipes"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-relaxed pb-2"
            delay={0.2}
          />
          
          <AnimatedText 
            text="Join our community of food lovers"
            className="mt-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground leading-relaxed"
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
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 transition-all"
              onClick={handleShareClick}
            >
              Create Recipe
            </Button>
            <Link href="/explore">
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-foreground hover:bg-primary/10 h-11"
              >
                Explore Recipes
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="min-h-screen py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="w-full">
            <h2 className="text-3xl font-bold mb-12 text-center">Featured Recipes</h2>
            {loading ? (
              <div className="text-center">Loading recipes...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <Link href={`/recipes/${recipe.$id}`} key={recipe.$id}>
                    <Card className="flex flex-col h-[400px] border-secondary hover:shadow-lg transition-all duration-300">
                      <div className="relative w-full h-48">
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          className="object-cover rounded-t-lg"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={true}
                        />
                      </div>
                      <div className="flex flex-col flex-1 p-6">
                        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                        <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                          {recipe.description}
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.time} Minutes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{recipe.servings} servings</span>
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
      </div>
    </div>
  );
}