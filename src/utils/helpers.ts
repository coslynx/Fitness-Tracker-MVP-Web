import { API_URL } from '@/common/constants';
import { getAuthToken } from '@/common/utils';
import axios from 'axios';

// Define the interface for API request options
interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  headers?: any;
}

// Function to make API requests
export const apiRequest = async <T>(options: ApiRequestOptions): Promise<T> => {
  const token = getAuthToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await axios({
      method: options.method,
      url: `${API_URL}${options.url}`,
      data: options.data,
      headers: { ...authHeaders, ...options.headers },
    });

    return response.data;
  } catch (error: any) {
    // Handle API request errors, such as network errors, authorization failures, or server errors.
    // You can log the error using console.error() or a logging library, and throw a custom error with a specific error message for the frontend to handle.
    // Consider retrying the request if there's a network error.
    throw new Error('API request failed');
  }
};

// Example function to fetch user goals
export const getGoals = async (userId: number): Promise<any[]> => {
  try {
    const response = await apiRequest({
      method: 'GET',
      url: `/goals?userId=${userId}`,
    });
    return response;
  } catch (error) {
    // Handle errors during goal retrieval.
    throw error;
  }
};

// Example function to create a new user goal
export const createGoal = async (goalData: any, userId: number): Promise<any> => {
  try {
    const response = await apiRequest({
      method: 'POST',
      url: '/goals',
      data: goalData,
      headers: { userId },
    });
    return response;
  } catch (error) {
    // Handle errors during goal creation.
    throw error;
  }
};

// Example function to update an existing user goal
export const updateGoal = async (goalId: number, goalData: any): Promise<any> => {
  try {
    const response = await apiRequest({
      method: 'PUT',
      url: `/goals/${goalId}`,
      data: goalData,
    });
    return response;
  } catch (error) {
    // Handle errors during goal update.
    throw error;
  }
};

// Example function to delete a user goal
export const deleteGoal = async (goalId: number): Promise<any> => {
  try {
    const response = await apiRequest({
      method: 'DELETE',
      url: `/goals/${goalId}`,
    });
    return response;
  } catch (error) {
    // Handle errors during goal deletion.
    throw error;
  }
};

// Example function to fetch user activities
export const getActivities = async (userId: number): Promise<any[]> => {
  try {
    const response = await apiRequest({
      method: 'GET',
      url: `/activities?userId=${userId}`,
    });
    return response;
  } catch (error) {
    // Handle errors during activity retrieval.
    throw error;
  }
};

// Example function to create a new user activity
export const createActivity = async (activityData: any, userId: number): Promise<any> => {
  try {
    const response = await apiRequest({
      method: 'POST',
      url: '/activities',
      data: activityData,
      headers: { userId },
    });
    return response;
  } catch (error) {
    // Handle errors during activity creation.
    throw error;
  }
};

// Example function to update an existing user activity
export const updateActivity = async (activityId: number, activityData: any): Promise<any> => {
  try {
    const response = await apiRequest({
      method: 'PUT',
      url: `/activities/${activityId}`,
      data: activityData,
    });
    return response;
  } catch (error) {
    // Handle errors during activity update.
    throw error;
  }
};

// Example function to delete a user activity
export const deleteActivity = async (activityId: number): Promise<any> => {
  try {
    const response = await apiRequest({
      method: 'DELETE',
      url: `/activities/${activityId}`,
    });
    return response;
  } catch (error) {
    // Handle errors during activity deletion.
    throw error;
  }
};

// Example function to fetch user profile
export const getUserProfile = async (userId: number): Promise<any> => {
  try {
    const response = await apiRequest({
      method: 'GET',
      url: `/users/${userId}`,
    });
    return response;
  } catch (error) {
    // Handle errors during profile retrieval.
    throw error;
  }
};

// Example function to update user profile
export const updateUserProfile = async (userId: number, profileData: any): Promise<any> => {
  try {
    const response = await apiRequest({
      method: 'PUT',
      url: `/users/${userId}`,
      data: profileData,
    });
    return response;
  } catch (error) {
    // Handle errors during profile update.
    throw error;
  }
};

// Example function to fetch progress data
export const getProgressData = async (userId: number): Promise<any> => {
  try {
    const response = await apiRequest({
      method: 'GET',
      url: `/progress?userId=${userId}`,
    });
    return response;
  } catch (error) {
    // Handle errors during progress data retrieval.
    throw error;
  }
};