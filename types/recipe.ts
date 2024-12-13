export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Recipe {
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

export interface User {
  $id: string;
  name: string;
  email: string;
  photoUrl?: string;
  providerAccessToken?: string;
  emailVerification: boolean;
} 