export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Recipe {
  $id: string;
  $createdAt: string;
  title: string;
  description: string;
  time: string;
  servings: number;
  ingredients: string;
  instructions: string;
  image: string;
  users: string;
}

export interface User {
  $id: string;
  name: string;
  email: string;
  photoUrl?: string;
  providerAccessToken?: string;
  emailVerification: boolean;
} 