import { User } from '@prisma/client';

// Define the interface for a Goal
export interface Goal {
  id: number;
  userId: User;
  name: string;
  target: number;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  progress?: number;
  units?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the interface for creating a new goal
export interface CreateGoalInput {
  name: string;
  target: number;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  units?: string;
}

// Define the interface for updating an existing goal
export interface UpdateGoalInput {
  name?: string;
  target?: number;
  timeframe?: string;
  startDate?: Date;
  endDate?: Date;
  progress?: number;
  units?: string;
}

// Define the interface for the response when retrieving goals
export interface GetGoalsResponse {
  success: boolean;
  data: Goal[];
}

// Define the interface for the response when creating a new goal
export interface CreateGoalResponse {
  success: boolean;
  data: Goal;
}

// Define the interface for the response when updating an existing goal
export interface UpdateGoalResponse {
  success: boolean;
  data: Goal;
}

// Define the interface for the response when deleting a goal
export interface DeleteGoalResponse {
  success: boolean;
}

// Define the interface for the response when retrieving a goal by ID
export interface GetGoalByIdResponse {
  success: boolean;
  data: Goal;
}

// Define the interface for the response when retrieving a goal by name
export interface GetGoalByNameResponse {
  success: boolean;
  data: Goal;
}