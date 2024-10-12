'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Input, Button, Modal } from '@/components/common';
import { validateEmail, validatePassword } from '@/common/utils';
import { AuthError, Credentials } from '@/features/auth/types';
import { signIn } from '@/features/auth/services';
import { ERROR_CODES, SUCCESS_MESSAGES } from '@/common/constants';

const LoginPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const credentials: Credentials = {
      email,
      password,
    };

    try {
      // Validate user input
      const emailError = !validateEmail(email) ? 'Invalid email address' : '';
      const passwordError = !validatePassword(password)
        ? 'Password must be at least 8 characters long'
        : '';

      if (emailError || passwordError) {
        setErrorMessage(`${emailError || passwordError}`);
        setIsLoading(false);
        setShowModal(true);
        return;
      }

      // Sign in user
      const response = await signIn(credentials);

      if ('success' in response && response.success) {
        setErrorMessage(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        setIsLoading(false);
        setShowModal(true);
        router.push('/dashboard'); // Redirect to dashboard after successful login
      } else if ('code' in response && response.code === ERROR_CODES.INVALID_CREDENTIALS) {
        setErrorMessage(response.message);
        setIsLoading(false);
        setShowModal(true);
      } else {
        setErrorMessage('An error occurred during login. Please try again later.');
        setIsLoading(false);
        setShowModal(true);
      }
    } catch (error) {
      setErrorMessage('An error occurred during login. Please try again later.');
      setIsLoading(false);
      setShowModal(true);
      console.error('Error during login:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2>Log In</h2>
      <Input
        type="email"
        label="Email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        label="Password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging In...' : 'Log In'}
      </Button>
      <Modal show={showModal} onClose={handleCloseModal} title="Login">
        <p>{errorMessage}</p>
      </Modal>
      {session && (
        <p className="text-center text-gray-500">
          Don't have an account?{' '}
          <a href="/auth/register" className="text-blue-500 font-bold">
            Sign up
          </a>
        </p>
      )}
    </form>
  );
};

export default LoginPage;