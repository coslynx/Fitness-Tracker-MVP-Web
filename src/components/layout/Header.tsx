'use client'

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store';
import { Button, Loader, Modal } from '@/components/common';
import { AUTH_ENDPOINT } from '@/common/constants';
import { useRouter } from 'next/navigation';
import { UserProfileResponse, UserProfile } from '@/features/profile/types';
import { getUserProfile } from '@/features/profile/services';
import { ERROR_CODES } from '@/common/constants';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
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
    <header className="bg-white shadow-md py-4 px-4 fixed w-full z-10">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Fitness Tracker
        </Link>
        <nav className="flex gap-4">
          {session && (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
                Dashboard
              </Link>
              <Link href="/goals" className="text-gray-600 hover:text-gray-800">
                Goals
              </Link>
              <Link href="/activities" className="text-gray-600 hover:text-gray-800">
                Activity
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-800">
                Profile
              </Link>
              <div className="flex items-center gap-2">
                <img
                  src={userProfile?.imageUrl || '/default-profile.png'} // Use default image if no image is available
                  alt="User Profile Picture"
                  className="rounded-full w-8 h-8"
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
            </>
          )}
          {!session && (
            <>
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
            </>
          )}
        </nav>
      </div>
      <Modal show={showModal} onClose={handleCloseModal} title="Error">
        <p>{errorMessage}</p>
      </Modal>
    </header>
  );
};

export default Header;