import { User } from '@prisma/client';

// Define the interface for an Activity
export interface Activity {
  id: number;
  userId: User;
  type: string;
  date: Date;
  duration: number;
  intensity?: string;
  caloriesBurned?: number;
  distance?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the interface for creating a new activity
export interface CreateActivityInput {
  type: string;
  date: Date;
  duration: number;
  intensity?: string;
  caloriesBurned?: number;
  distance?: number;
  notes?: string;
}

// Define the interface for updating an existing activity
export interface UpdateActivityInput {
  type?: string;
  date?: Date;
  duration?: number;
  intensity?: string;
  caloriesBurned?: number;
  distance?: number;
  notes?: string;
}

// Define the interface for the response when retrieving activities
export interface GetActivitiesResponse {
  success: boolean;
  data: Activity[];
}

// Define the interface for the response when creating a new activity
export interface CreateActivityResponse {
  success: boolean;
  data: Activity;
}

// Define the interface for the response when updating an existing activity
export interface UpdateActivityResponse {
  success: boolean;
  data: Activity;
}

// Define the interface for the response when deleting an activity
export interface DeleteActivityResponse {
  success: boolean;
}

// Define the interface for the response when retrieving an activity by ID
export interface GetActivityByIdResponse {
  success: boolean;
  data: Activity;
}