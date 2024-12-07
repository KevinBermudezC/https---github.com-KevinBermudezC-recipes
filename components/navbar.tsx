"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from '@/lib/auth';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full border-b bg-background/50 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <UtensilsCrossed className="h-6 w-6" />
            <span className="font-bold text-lg">Shared Recipes</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/explore" className="text-sm font-medium hover:text-primary">
              Explore
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/create-recipe">
                  <Button variant="ghost">Create Recipe</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-800">
                    Register
                  </Button>
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-4">
                  <Link
                    href="/explore"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Explore
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link href="/create-recipe">
                        <Button variant="ghost" className="w-full justify-start">
                          Create Recipe
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={logout}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button 
                          className="w-full justify-start bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-800"
                        >
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}