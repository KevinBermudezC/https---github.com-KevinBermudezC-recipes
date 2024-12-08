"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Menu, Plus, User, LogOut } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useAuthContext } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const { user, signOut } = useAuthContext();

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        <nav className="flex h-14 items-center justify-between">
          <Link href="/" className="font-bold text-xl flex items-center space-x-2">
            <UtensilsCrossed className="h-6 w-6" />
            <span>CookBook</span>
          </Link>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/create-recipe">
                  <Button variant="ghost" size="icon" title="Create Recipe">
                    <Plus className="h-5 w-5" />
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user.providerAccessToken ? `https://lh3.googleusercontent.com/a/${user.providerAccessToken}` : undefined} 
                          alt={user.name || 'User'} 
                        />
                        <AvatarFallback>
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <Link href="/profile">
                      <DropdownMenuItem className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>{user.name || 'User'}</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      className="flex items-center text-red-600 focus:text-red-600"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                {/* Menú para desktop */}
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/explore">
                    <Button variant="ghost">Explore</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Register</Button>
                  </Link>
                </div>

                {/* Menú hamburguesa para mobile */}
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                        <SheetDescription>
                        </SheetDescription>
                      </SheetHeader>
                      <div className="flex flex-col space-y-4 mt-4">
                        <Link href="/explore">
                          <Button variant="ghost" className="w-full justify-start">
                            Explore
                          </Button>
                        </Link>
                        <Link href="/login">
                          <Button variant="ghost" className="w-full justify-start">
                            Login
                          </Button>
                        </Link>
                        <Link href="/register">
                          <Button className="w-full justify-start">
                            Register
                          </Button>
                        </Link>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}