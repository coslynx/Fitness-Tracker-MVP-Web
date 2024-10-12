import axios from 'axios';
import { API_URL, ERROR_CODES } from '@/common/constants';
import { getAuthToken } from '@/common/utils';
import { User, Goal, Activity, ProgressData } from '@/types';

// Define the interface for the API response
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}

// Define the interface for the API error
interface ApiError {
  code: number;
  message: string;
}

// Function to make API requests
const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  headers?: any
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      data,
      headers: { ...authHeaders, ...headers },
    });

    // Handle successful API responses
    if (response.status >= 200 && response.status < 300) {
      return { success: true, data: response.data };
    } else {
      // Handle unexpected API responses
      return { success: false, message: 'An unexpected error occurred.' };
    }
  } catch (error: any) {
    // Handle API request errors
    if (error.response) {
      // Handle errors returned by the API server
      const { status, data } = error.response;
      if (status === ERROR_CODES.UNAUTHORIZED) {
        // Handle unauthorized requests
        return { success: false, message: 'Unauthorized access.' };
      } else {
        // Handle other API errors
        return {
          success: false,
          message: data?.message || 'An error occurred.',
          code: status,
        };
      }
    } else {
      // Handle network errors or other client-side errors
      return { success: false, message: 'Network error.' };
    }
  }
};

// API endpoint for user authentication (using NextAuth.js)
export const authApi = {
  signIn: async (credentials: Credentials): Promise<ApiResponse<AuthSession>> => {
    // Implement login logic using NextAuth.js
    // ...
  },
  signOut: async (): Promise<ApiResponse<void>> => {
    // Implement logout logic using NextAuth.js
    // ...
  },
};

// API endpoints for user management
export const userApi = {
  // Retrieve user profile by ID
  getUserProfile: async (userId: number): Promise<ApiResponse<User>> => {
    return await apiRequest('GET', `/users/${userId}`);
  },

  // Update user profile
  updateUserProfile: async (userId: number, profileData: User): Promise<ApiResponse<User>> => {
    return await apiRequest('PUT', `/users/${userId}`, profileData);
  },
};

// API endpoints for goal management
export const goalApi = {
  // Retrieve all goals for a user
  getGoals: async (userId: number): Promise<ApiResponse<Goal[]>> => {
    return await apiRequest('GET', `/goals?userId=${userId}`);
  },

  // Create a new goal for a user
  createGoal: async (userId: number, goalData: Goal): Promise<ApiResponse<Goal>> => {
    return await apiRequest('POST', `/goals`, goalData, { userId });
  },

  // Update an existing goal
  updateGoal: async (goalId: number, goalData: Goal): Promise<ApiResponse<Goal>> => {
    return await apiRequest('PUT', `/goals/${goalId}`, goalData);
  },

  // Delete a goal
  deleteGoal: async (goalId: number): Promise<ApiResponse<void>> => {
    return await apiRequest('DELETE', `/goals/${goalId}`);
  },
};

// API endpoints for activity management
export const activityApi = {
  // Retrieve all activities for a user
  getActivities: async (userId: number): Promise<ApiResponse<Activity[]>> => {
    return await apiRequest('GET', `/activities?userId=${userId}`);
  },

  // Create a new activity for a user
  createActivity: async (userId: number, activityData: Activity): Promise<ApiResponse<Activity>> => {
    return await apiRequest('POST', `/activities`, activityData, { userId });
  },

  // Update an existing activity
  updateActivity: async (activityId: number, activityData: Activity): Promise<ApiResponse<Activity>> => {
    return await apiRequest('PUT', `/activities/${activityId}`, activityData);
  },

  // Delete an activity
  deleteActivity: async (activityId: number): Promise<ApiResponse<void>> => {
    return await apiRequest('DELETE', `/activities/${activityId}`);
  },
};

// API endpoints for progress data
export const progressApi = {
  // Retrieve progress data for a user
  getProgressData: async (userId: number): Promise<ApiResponse<ProgressData>> => {
    return await apiRequest('GET', `/progress?userId=${userId}`);
  },
};