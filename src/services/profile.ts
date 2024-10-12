import { PrismaClient } from '@prisma/client';
import { UserProfile, UserProfileResponse } from '@/features/profile/types';
import { USERS_ENDPOINT, ERROR_CODES } from '@/common/constants';
import { apiRequest } from '@/common/utils';

const prisma = new PrismaClient();

export const getUserProfile = async (userId: number): Promise<UserProfileResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        age: true,
        weight: true,
      },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return { success: false, message: 'An error occurred while retrieving your profile.' };
  }
};

export const updateUserProfile = async (userId: number, profileData: UserProfile): Promise<UserProfileResponse> => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: profileData,
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        age: true,
        weight: true,
      },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, message: 'An error occurred while updating your profile.' };
  }
};