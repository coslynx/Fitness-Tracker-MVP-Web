import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input, Button, Modal } from '@/components/common';
import { UserProfile, UserProfileResponse } from '@/features/profile/types';
import { getUserProfile, updateUserProfile } from '@/features/profile/services';
import { ERROR_CODES, SUCCESS_MESSAGES } from '@/common/constants';
import { useStore } from '@/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const UserProfile = () => {
  const { data: session } = useSession();
  const { userProfile, setUserProfile } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    gender: yup.string().required('Gender is required'),
    age: yup
      .number()
      .required('Age is required')
      .min(1, 'Age must be at least 1'),
    weight: yup
      .number()
      .required('Weight is required')
      .min(1, 'Weight must be at least 1'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserProfile>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: userProfile?.name || '',
      gender: userProfile?.gender || '',
      age: userProfile?.age || 0,
      weight: userProfile?.weight || 0,
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        if (session?.user.id) {
          const response: UserProfileResponse = await getUserProfile(
            session.user.id
          );
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

  const onSubmit = async (data: UserProfile) => {
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
        reset();
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2>Your Profile</h2>
      <Input
        type="text"
        label="Name"
        placeholder="Your Name"
        {...register('name')}
        error={errors.name?.message}
        required
      />
      <Input
        type="text"
        label="Gender"
        placeholder="Your Gender"
        {...register('gender')}
        error={errors.gender?.message}
        required
      />
      <Input
        type="number"
        label="Age"
        placeholder="Your Age"
        {...register('age')}
        error={errors.age?.message}
        required
      />
      <Input
        type="number"
        label="Weight (lbs)"
        placeholder="Your Weight"
        {...register('weight')}
        error={errors.weight?.message}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
      <Modal show={showModal} onClose={handleCloseModal} title="Success">
        <p>{errorMessage}</p>
      </Modal>
    </form>
  );
};

export default UserProfile;