import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserProfile, UserProfileResponse } from '@/features/profile/types';
import { getUserProfile, updateUserProfile } from '@/features/profile/services';
import { ERROR_CODES, SUCCESS_MESSAGES } from '@/common/constants';
import { useStore } from '@/store';
import { useRouter } from 'next/navigation';

const useProfile = () => {
  const { data: session } = useSession();
  const { userProfile, setUserProfile } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
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

  const updateProfile = async (data: UserProfile) => {
    try {
      setIsLoading(true);
      if (session?.user.id) {
        const updatedProfile: UserProfile = await updateUserProfile(
          session.user.id,
          data
        );
        setUserProfile(updatedProfile);
        setErrorMessage(SUCCESS_MESSAGES.ACTIVITY_UPDATED);
        setShowModal(true);
      }
    } catch (error: any) {
      if (error.response?.status === ERROR_CODES.UNAUTHORIZED) {
        router.push('/auth/login');
      } else {
        setShowModal(true);
        setErrorMessage(
          error.response?.data?.message ||
            'An error occurred while updating your profile.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  return {
    userProfile,
    isLoading,
    updateProfile,
    showModal,
    errorMessage,
    handleCloseModal,
  };
};

export default useProfile;