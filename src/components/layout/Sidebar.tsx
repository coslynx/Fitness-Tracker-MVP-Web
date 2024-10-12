'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store';
import { Button, Loader, Modal } from '@/components/common';
import { AUTH_ENDPOINT } from '@/common/constants';
import { UserProfileResponse, UserProfile } from '@/features/profile/types';
import { getUserProfile } from '@/features/profile/services';
import { ERROR_CODES } from '@/common/constants';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { userProfile, setUserProfile } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (session?.user.id) {
          const response: UserProfileResponse = await getUserProfile(session.user.id);
          if (response.success) {
            setUserProfile(response.data);
          } else {
            setErrorMessage(response.message || 'Error fetching profile');
            setShowModal(true);
          }
        }
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.message ||
            'An error occurred while fetching your profile.'
        );
        setShowModal(true);
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [session, setUserProfile]);

  const handleLogout = () => {
    // Implement logout logic here
    // You might need to call an API endpoint or use next-auth's signOut function
    // ...
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <aside className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Fitness Tracker</h2>
      <nav>
        <ul className="flex flex-col gap-4">
          <li>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-500">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/goals" className="text-gray-700 hover:text-blue-500">
              Goals
            </Link>
          </li>
          <li>
            <Link href="/activities" className="text-gray-700 hover:text-blue-500">
              Activity
            </Link>
          </li>
          <li>
            <Link href="/profile" className="text-gray-700 hover:text-blue-500">
              Profile
            </Link>
          </li>
        </ul>
      </nav>
      {session && (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <img
              src={userProfile?.imageUrl || '/default-profile.png'} // Use default image if no image is available
              alt="User Profile Picture"
              className="rounded-full w-10 h-10"
            />
            <p className="text-gray-700 font-medium">
              {userProfile?.name || 'User'}
            </p>
          </div>
          <Button
            type="button"
            onClick={handleLogout}
            className="mt-4"
            variant="secondary"
          >
            Log Out
          </Button>
        </div>
      )}
      {!session && (
        <div className="mt-4">
          <Button
            type="button"
            onClick={() => router.push(`${AUTH_ENDPOINT}/login`)}
            className="mt-4"
            variant="primary"
          >
            Log In
          </Button>
          <Button
            type="button"
            onClick={() => router.push(`${AUTH_ENDPOINT}/register`)}
            className="mt-2"
            variant="secondary"
          >
            Sign Up
          </Button>
        </div>
      )}
      <Modal show={showModal} onClose={handleCloseModal} title="Error">
        <p>{errorMessage}</p>
      </Modal>
    </aside>
  );
};

export default Sidebar;