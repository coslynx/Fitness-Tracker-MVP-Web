import { DATA_UNITS } from '@/common/constants';

// Function to format a number with appropriate units (e.g., weight in lbs, distance in miles)
export const formatNumberWithUnits = (value: number, unit: string): string => {
  // Check if the provided unit is valid
  if (!DATA_UNITS[unit]) {
    throw new Error(`Invalid unit: ${unit}`);
  }

  // Format the number with the specified unit
  return `${value.toFixed(2)} ${DATA_UNITS[unit]}`;
};

// Function to format a date into a user-friendly string (e.g., "January 1, 2024")
export const formatDate = (date: Date): string => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Function to format a time into a user-friendly string (e.g., "12:00 PM")
export const formatTime = (date: Date): string => {
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleTimeString('en-US', options);
};

// Function to calculate calories burned based on activity type, duration, and intensity
export const calculateCaloriesBurned = (
  activityType: string,
  duration: number,
  intensity: string
): number => {
  // Implement logic for calculating calories burned based on activity type, duration, and intensity
  // You can use pre-defined formulas or lookup tables for different activities
  // Consider using constants from './constants.ts' for activity-specific data
  // Ensure proper error handling for invalid input parameters
  return 0;
};