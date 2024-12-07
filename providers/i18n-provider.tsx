"use client";

import { ReactNode, useEffect, useState } from 'react';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          nav: {
            createRecipe: 'Create Recipe',
            login: 'Login',
            register: 'Register',
          },
          home: {
            title: 'Discover and share amazing recipes',
            subtitle: 'Join our cooking community. Share your favorite recipes and discover new culinary inspirations.',
            shareRecipe: 'Share Recipe',
            exploreRecipes: 'Explore Recipes',
            featuredRecipes: 'Featured Recipes',
            servings: 'servings',
          },
        },
      },
      es: {
        translation: {
          nav: {
            createRecipe: 'Crear Receta',
            login: 'Iniciar Sesión',
            register: 'Registrarse',
          },
          home: {
            title: 'Descubre y comparte recetas increíbles',
            subtitle: 'Únete a nuestra comunidad de amantes de la cocina. Comparte tus recetas favoritas y descubre nuevas inspiraciones culinarias.',
            shareRecipe: 'Compartir Receta',
            exploreRecipes: 'Explorar Recetas',
            featuredRecipes: 'Recetas Destacadas',
            servings: 'porciones',
          },
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}