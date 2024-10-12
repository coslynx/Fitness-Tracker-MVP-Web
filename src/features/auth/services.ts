import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { User } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { AUTH_ENDPOINT, ERROR_CODES } from '@/common/constants';
import { prisma } from '@/database/client';
import { User as UserType, Session } from '@/types/user';

// Import types for type safety in the authentication service
import { AuthSession, AuthError } from '@/features/auth/types';
import { getAuthToken } from '@/common/utils';

// Ensure the correct version of the 'next-auth' package is used
const nextAuthVersion = '4.24.8';

// Ensure proper initialization of NextAuth.js 
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Add other providers as needed, e.g., Facebook, Email/Password, etc.
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user data to the session object, retrieved from the database
      const user: UserType = await prisma.user.findUnique({
        where: {
          id: token.id as number,
        },
      });

      // Access user data within the session object
      // e.g., session.user.name, session.user.email, etc.

      // Return the updated session object
      return { ...session, user };
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure secret is set for security
  pages: {
    signIn: '/auth/login', // Specify custom sign-in page
    signOut: '/auth/logout', // Specify custom sign-out page
    // Error: '/auth/error', // Specify custom error page
  },
  // Database: {
  //   adapter: 'prisma',
  //   prisma: {
  //     client: prisma, // Use Prisma ORM for database interactions
  //   },
  // },
});

// API Route for authentication 
export { handler as GET, handler as POST };

// Function to get the current user's session
export const getCurrentSession = async (req: NextApiRequest): Promise<Session | null> => {
  const session = await getSession({ req });
  if (!session) {
    return null;
  }

  const user: UserType = await prisma.user.findUnique({
    where: {
      id: session.user.id as number,
    },
  });

  return { ...session, user };
};

// Example function to retrieve the current user's data from the database
export const getCurrentUser = async (req: NextApiRequest): Promise<UserType | null> => {
  try {
    // Retrieve the user's session data
    const session = await getCurrentSession(req);

    // Ensure the user is authenticated
    if (!session) {
      return null;
    }

    // Retrieve the user's data from the database
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id as number,
      },
    });

    // Return the user data
    return user;
  } catch (error) {
    // Handle errors during user retrieval
    console.error('Error retrieving user:', error);
    return null;
  }
};

// Example function for checking if a user is authenticated
export const isAuthenticated = async (req: NextApiRequest): Promise<boolean> => {
  // Retrieve the user's session data
  const session = await getCurrentSession(req);
  // Return true if the user is authenticated
  return !!session;
};

// Function for handling authentication errors
export const handleAuthError = (error: any): AuthError => {
  if (error.code === 'INVALID_CREDENTIALS') {
    return {
      code: ERROR_CODES.INVALID_CREDENTIALS,
      message: 'Invalid email or password',
    };
  }

  // Handle other error types as needed
  // ...

  // Default error handling
  return {
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: 'An error occurred during authentication. Please try again later.',
  };
};

// Example function for signing in a user
export const signIn = async (req: NextApiRequest, res: NextApiResponse): Promise<AuthSession | AuthError> => {
  try {
    const token = getAuthToken();
    if (token) {
      // Token exists, redirect to the home page
      return res.status(200).json({ success: true, message: 'Already logged in' });
    } else {
      // Handle the sign-in request from the frontend
      // const { email, password } = req.body; // Retrieve sign-in credentials

      // Validate the email and password
      // const validationErrors = validateCredentials(email, password); // Implement this validation function
      // if (validationErrors) {
      //   return res.status(400).json({ success: false, errors: validationErrors });
      // }

      // TODO: Call the sign-in API with validated credentials
      // const signInResponse = await signInUser(email, password); // Implement this sign-in function
      // Handle the sign-in response and redirect the user
      // return res.status(200).json({ success: true, message: 'Login successful' });
    }
  } catch (error) {
    // Handle authentication errors
    const authError = handleAuthError(error);
    return res.status(authError.code).json({ success: false, ...authError });
  }
};

// Example function for signing out a user
export const signOut = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Handle the sign-out request from the frontend
    // ...

    // Call the sign-out API
    // const signOutResponse = await signOutUser(); // Implement this sign-out function

    // Handle the sign-out response and redirect the user
    // ...

    // Redirect the user to the home page after signing out
    return res.redirect('/');
  } catch (error) {
    // Handle sign-out errors
    console.error('Error signing out:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during sign out' });
  }
};