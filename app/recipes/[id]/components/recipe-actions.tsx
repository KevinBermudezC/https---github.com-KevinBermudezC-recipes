"use client";

import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";

export function RecipeActions() {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon">
        <Heart className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon">
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
} 