"use client";

import { UtensilsCrossed, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col py-8 md:h-24 md:py-0 md:flex-row items-center justify-between">
          {/* Logo */}
          <div className="mb-4 md:mb-0">
            <Link href="/" className="font-bold text-xl flex items-center space-x-2">
              <UtensilsCrossed className="h-6 w-6" />
              <span>CookBook</span>
            </Link>
          </div>

          {/* Built with */}
          <div className="flex-1 text-center max-w-[500px] mx-auto mb-4 md:mb-0">
            <p className="text-sm leading-loose px-4">
              Built with <Heart className="inline-block h-4 w-4 text-red-500 animate-pulse" /> by{" "}
              <a
                href="https://github.com/KevinBermudezC"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                Kevin Bermudez
              </a>
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CookBook.
              <br className="md:hidden" /> All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 