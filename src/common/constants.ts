export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const AUTH_ENDPOINT = '/auth';
export const USERS_ENDPOINT = '/users';
export const GOALS_ENDPOINT = '/goals';
export const ACTIVITIES_ENDPOINT = '/activities';
export const PROGRESS_ENDPOINT = '/progress';

export const DEFAULT_GOAL_TIMEFRAME = 'weekly';
export const DEFAULT_GOAL_UNITS = 'lbs';

export const VALID_ACTIVITY_TYPES = ['running', 'cycling', 'swimming', 'weightlifting'];

export const ERROR_CODES = {
  INVALID_CREDENTIALS: 401,
  USER_NOT_FOUND: 404,
  GOAL_NOT_FOUND: 404,
  ACTIVITY_NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  GOAL_CREATED: 'Goal created successfully',
  GOAL_UPDATED: 'Goal updated successfully',
  ACTIVITY_CREATED: 'Activity created successfully',
  ACTIVITY_UPDATED: 'Activity updated successfully',
};

export const DATA_UNITS = {
  WEIGHT: 'lbs',
  DISTANCE: 'miles',
  CALORIES: 'kcal',
};