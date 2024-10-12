'use client'

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common';
import { AUTH_ENDPOINT } from '@/common/constants';

const IndexPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogin = () => {
    router.push(`${AUTH_ENDPOINT}/login`);
  };

  const handleSignup = () => {
    router.push(`${AUTH_ENDPOINT}/register`);
  };

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-24 px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome back, {session.user.name}!</h1>
        <p className="text-lg mb-6">You are now logged in.</p>
        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-24 px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Fitness Tracker</h1>
        <p className="text-lg mb-6">
          Track your fitness goals, monitor your progress, and connect with a supportive community.
        </p>
        <Button onClick={handleLogin}>Log In</Button>
        <Button onClick={handleSignup} className="mt-4">Sign Up</Button>
      </div>
    );
  }
};

export default IndexPage;