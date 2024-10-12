import { useSession, Session } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { AuthSession } from '@/features/auth/types';
import { getAuthToken } from '@/common/utils'; 
import { getCurrentSession } from '@/features/auth/services'; 

// Ensure the correct version of the 'next-auth' package is used
const nextAuthVersion = '4.24.8'; 

const useAuth = (): AuthSession | null => {
  const { data: session } = useSession(); // Use NextAuth.js's useSession hook to access session data
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the authentication token from local storage or the session (using getAuthToken from src/common/utils.ts)
    const storedToken = getAuthToken(); 
    setAuthToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      // Fetch the current session data if the token exists (using getCurrentSession from src/features/auth/services.ts)
      if (authToken) {
        const sessionData: Session | null = await getCurrentSession();
        // Update the state with the fetched session data if it's available
        if (sessionData) { 
          // Ensure the sessionData is cast correctly before updating the state to maintain type safety
          // Access the session's user data, access token, and refresh token (if available)
          setAuthToken(sessionData.user.id.toString()); 
        }
      }
    };
    fetchSession();
  }, [authToken]);

  // Return the authentication session data if the token is available, otherwise return null
  return authToken ? {
    user: session?.user as any, // Ensure the user object is cast correctly
    accessToken: authToken, 
    refreshToken: session?.refreshToken, 
    idToken: session?.idToken
  } : null;
};

export default useAuth;