import { User } from '@prisma/client';
import { Session } from 'next-auth/react';

// Define the interface for user credentials
export interface Credentials {
  email: string;
  password?: string;
}

// Define the interface for authentication tokens
export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
}

// Define the interface for user session data
export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
}

// Define the interface for authentication errors
export interface AuthError {
  code: number;
  message: string;
}

// Define the interface for the authentication response
export interface AuthResponse {
  success: boolean;
  data: AuthSession | AuthError;
}

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
}

// Define the interface for user session data
export interface UserSession {
  user: User;
  token: AuthToken;
}

// Define the interface for a user
export interface User {
  id: number;
  email: string;
  password?: string;
  username?: string;
  name?: string;
  gender?: string;
  age?: number;
  weight?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the interface for the user response
export interface UserResponse {
  success: boolean;
  data: User;
}

// Define the interface for the user list response
export interface UserListResponse {
  success: boolean;
  data: User[];
}

// Define the interface for the user session response
export interface UserSessionResponse {
  success: boolean;
  data: UserSession;
}

// Define the interface for the user session response
export interface SessionResponse {
  success: boolean;
  data: Session;
}