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

export function Navbar() {
  const { user, signOut } = useAuthContext();

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center">
        <div className="flex items-center space-x-8 flex-1">
          {/* Logo - sin requerir autenticación */}
          <Link href="/" className="font-bold text-xl flex items-center space-x-2" passHref>
            <UtensilsCrossed className="h-6 w-6" />
            <span>CookBook</span>
          </Link>

          {/* Navigation Links - sin requerir autenticación */}
          <div className="hidden md:flex space-x-4">
            <Link href="/explore">
              <Button variant="ghost">Explore Recipes</Button>
            </Link>
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <>
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
            </>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}