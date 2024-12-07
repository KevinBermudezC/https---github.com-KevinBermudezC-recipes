"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("es") ? "en" : "es";
    i18n.changeLanguage(newLang);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Languages className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">
        {i18n.language.startsWith("es") ? "Switch to English" : "Cambiar a Español"}
      </span>
    </Button>
  );
}