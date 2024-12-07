import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
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
  });

export default i18n;