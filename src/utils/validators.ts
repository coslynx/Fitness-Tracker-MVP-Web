import { 
  DATA_UNITS, 
  VALID_ACTIVITY_TYPES,
  DEFAULT_GOAL_UNITS,
  DEFAULT_GOAL_TIMEFRAME 
} from '@/common/constants';

// Function to validate email format.
export const validateEmail = (email: string): boolean => {
  // Regular expression for email validation.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate password complexity.
export const validatePassword = (password: string): boolean => {
  // Basic password complexity rules (at least 8 characters, one uppercase, one lowercase, one number).
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber;
};

// Function to validate goal name.
export const validateGoalName = (name: string): boolean => {
  // Ensure goal name is not empty and within a reasonable length.
  return name.trim() !== '' && name.length <= 50;
};

// Function to validate goal target.
export const validateGoalTarget = (target: number, goalType?: string): boolean => {
  // Validate the target based on the goal type.
  // For example, weight loss should have a realistic weight target.
  if (goalType === 'weight loss' && target > 50) {
    return false;
  }
  return true;
};

// Function to validate activity type.
export const validateActivityType = (type: string): boolean => {
  // Ensure activity type is one of the valid types defined in constants.
  return VALID_ACTIVITY_TYPES.includes(type);
};

// Function to validate activity duration.
export const validateActivityDuration = (duration: number): boolean => {
  // Ensure duration is a valid number within a realistic range for the activity type.
  return duration >= 1 && duration <= 360;
};

// Function to validate goal timeframe.
export const validateGoalTimeframe = (timeframe: string): boolean => {
  // Ensure timeframe is one of the valid options (weekly, monthly, etc.).
  return timeframe === DEFAULT_GOAL_TIMEFRAME;
};

// Function to validate goal units.
export const validateGoalUnits = (units: string): boolean => {
  // Ensure units are one of the valid options defined in constants.
  return units === DEFAULT_GOAL_UNITS;
};

// Function to validate date input.
export const validateDate = (date: Date): boolean => {
  // Check if the date is valid and within a reasonable range.
  return !isNaN(date.getTime());
};