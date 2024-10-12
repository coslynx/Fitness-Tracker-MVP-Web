import { API_URL } from './constants';
import axios from 'axios';

export const formatDate = (date: Date): string => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const formatTime = (date: Date): string => {
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleTimeString('en-US', options);
};

export const calculateCaloriesBurned = (activityType: string, duration: number, intensity: string): number => {
  // Implement logic for calculating calories burned based on activity type, duration, and intensity.
  // You can use pre-defined formulas or lookup tables for different activities.
  // Consider using constants from './constants.ts' for activity-specific data.
  // Ensure proper error handling for invalid input parameters.
  return 0;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Implement password validation rules, including length requirements, character types, and complexity.
  // Consider using a library like zxcvbn for more robust password strength assessment.
  return true;
};

export const validateGoalName = (name: string): boolean => {
  // Implement validation for goal name, ensuring it's not empty, within length limits, and meets any specific requirements.
  return true;
};

export const validateGoalTarget = (target: number): boolean => {
  // Implement validation for goal target, ensuring it's a valid number within a realistic range for the goal type.
  return true;
};

export const validateActivityType = (type: string): boolean => {
  // Implement validation for activity type, ensuring it's a valid type from a predefined list.
  // You can use constants from './constants.ts' for the list of valid activity types.
  return true;
};

export const validateActivityDuration = (duration: number): boolean => {
  // Implement validation for activity duration, ensuring it's a valid number within a realistic range for the activity type.
  return true;
};

export const getAuthToken = (): string | null => {
  // Implement logic to retrieve the authentication token from local storage or the session.
  // Ensure proper error handling if the token is not found or invalid.
  return null;
};

export const apiRequest = async <T>(method: string, url: string, data?: any): Promise<T> => {
  const token = getAuthToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  try {
    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      data,
      headers,
    });
    return response.data;
  } catch (error: any) {
    // Handle API request errors, such as network errors, authorization failures, or server errors.
    // You can log the error using console.error() or a logging library, and throw a custom error with a specific error message for the frontend to handle.
    // Consider retrying the request if there's a network error.
    throw new Error('API request failed');
  }
};

export const getGoals = async (): Promise<any[]> => {
  try {
    return await apiRequest('GET', '/goals');
  } catch (error) {
    // Handle errors during goal retrieval.
    throw error;
  }
};

export const createGoal = async (goalData: any): Promise<any> => {
  try {
    return await apiRequest('POST', '/goals', goalData);
  } catch (error) {
    // Handle errors during goal creation.
    throw error;
  }
};

export const updateGoal = async (goalId: number, goalData: any): Promise<any> => {
  try {
    return await apiRequest('PUT', `/goals/${goalId}`, goalData);
  } catch (error) {
    // Handle errors during goal update.
    throw error;
  }
};

export const deleteGoal = async (goalId: number): Promise<any> => {
  try {
    return await apiRequest('DELETE', `/goals/${goalId}`);
  } catch (error) {
    // Handle errors during goal deletion.
    throw error;
  }
};

export const getActivities = async (): Promise<any[]> => {
  try {
    return await apiRequest('GET', '/activities');
  } catch (error) {
    // Handle errors during activity retrieval.
    throw error;
  }
};

export const createActivity = async (activityData: any): Promise<any> => {
  try {
    return await apiRequest('POST', '/activities', activityData);
  } catch (error) {
    // Handle errors during activity creation.
    throw error;
  }
};

export const updateActivity = async (activityId: number, activityData: any): Promise<any> => {
  try {
    return await apiRequest('PUT', `/activities/${activityId}`, activityData);
  } catch (error) {
    // Handle errors during activity update.
    throw error;
  }
};

export const deleteActivity = async (activityId: number): Promise<any> => {
  try {
    return await apiRequest('DELETE', `/activities/${activityId}`);
  } catch (error) {
    // Handle errors during activity deletion.
    throw error;
  }
};

export const getUserProfile = async (): Promise<any> => {
  try {
    return await apiRequest('GET', '/profile');
  } catch (error) {
    // Handle errors during profile retrieval.
    throw error;
  }
};

export const updateUserProfile = async (profileData: any): Promise<any> => {
  try {
    return await apiRequest('PUT', '/profile', profileData);
  } catch (error) {
    // Handle errors during profile update.
    throw error;
  }
};

export const getProgressData = async (): Promise<any> => {
  try {
    return await apiRequest('GET', '/progress');
  } catch (error) {
    // Handle errors during progress data retrieval.
    throw error;
  }
};