import { User } from '@prisma/client';
import { Goal } from '@/features/goals/types';
import { Activity } from '@/features/activities/types';

// Define the interface for progress data
export interface ProgressData {
  userId: User;
  goals: Goal[];
  activities: Activity[];
  weightLossProgress?: number; // Example progress metric
  // Add other progress metrics as needed
}

// Define the interface for the progress report response
export interface ProgressReportResponse {
  success: boolean;
  data: ProgressData;
  message?: string;
}