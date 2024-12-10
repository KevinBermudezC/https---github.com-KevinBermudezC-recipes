# CookBook - Recipe Sharing Platform

CookBook is a modern web application that allows users to share and discover culinary recipes. Users can create, edit, and explore recipes through an intuitive and attractive interface, making recipe sharing an enjoyable experience.

## Technologies Used

**Frontend:**
- Next.js 14: React framework with Server-Side Rendering.
- TypeScript: Static typing for JavaScript.
- Tailwind CSS: Utility-first CSS framework.
- Shadcn/ui: Reusable UI components (Dialog, Dropdown Menu, Form, Input, Navigation Menu, Popover, Select, Sheet, and more).
- Framer Motion: Animation library.
- Lucide Icons: Modern and customizable icons.

**Backend Services:**
- Appwrite: Backend as a Service (BaaS) for user authentication, database management, file storage, and OAuth integration (Google, Facebook).

**Development Tools:**
- ESLint: JavaScript/TypeScript linter.
- Prettier: Code formatter.
- npm: Package manager.

## Key Features

**Authentication:**
- Email/password registration and login.
- Google and Facebook integration.
- User session management.
- Protected routes.

**Recipe Management:**
- Create recipes with image upload.
- Edit and delete recipes.
- Detailed ingredients system.
- Step-by-step instructions.
- Preparation time and servings.
- Recipe image optimization.

**User Interface:**
- Responsive design.
- Light/dark mode.
- Fluid animations.
- Intuitive navigation.
- Optimized image loading.
- Modern and clean UI.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/KevinBermudezC/recipes.git
   ```

2. Navigate to the project directory:
   ```bash
   cd cookbook
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables by creating a `.env.local` file with the following keys:
   ```
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_ENDPOINT=your_endpoint
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
   NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
cookbook/
├── app/                  # Next.js routes and pages
│   ├── create-recipe/    # Recipe creation page
│   ├── recipes/          # Recipe details and listing
│   ├── login/            # Authentication pages
│   └── register/         # User registration
├── components/           # Reusable components
│   ├── ui/               # UI components
│   └── recipe/           # Recipe-specific components
├── lib/                  # Utilities and configurations
│   ├── appwrite.ts       # Appwrite client setup
│   └── auth.ts           # Authentication context
├── types/                # TypeScript definitions
├── public/               # Static files
└── styles/               # Global styles
```

## API Integration

**Appwrite Setup:**
1. Create an Appwrite project.
2. Set up authentication methods (Email, Google, Facebook).
3. Create database collections for recipes.
4. Configure a storage bucket for images.
5. Set up environment variables as shown in the installation section.

**Database Schema:**
```typescript
interface Recipe {
  $id?: string;
  title: string;
  description: string;
  time: string;
  servings: number;
  ingredients: string;
  instructions: string;
  image: string;
  userId: string;
  $createdAt?: string;
}
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/AmazingFeature`.
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`.
4. Push to the branch: `git push origin feature/AmazingFeature`.
5. Open a Pull Request.

## Development Guidelines

- Follow TypeScript best practices.
- Use ESLint and Prettier for consistent code formatting.
- Write meaningful commit messages.
- Update documentation as needed.
- Test thoroughly before submitting pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

## Contact

Kevin Bermudez - [@KevinBermudezC](https://github.com/KevinBermudezC)  
Project Link: [CookBook Repository](https://github.com/KevinBermudezC/recipes)

## Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the amazing UI components.
- [Appwrite](https://appwrite.io/) for backend services.
- [Framer Motion](https://www.framer.com/motion/) for animations.
- [Lucide](https://lucide.dev/) for icons.
