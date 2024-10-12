import { User } from '@prisma/client';

// Define the interface for a user profile
export interface UserProfile {
  id: number;
  email: string;
  name: string;
  gender: string;
  age: number;
  weight: number;
}

// Define the interface for the user profile response
export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
  message?: string;
}