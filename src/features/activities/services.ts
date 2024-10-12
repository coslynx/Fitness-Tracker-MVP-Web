import { PrismaClient } from '@prisma/client';
import { Activity as ActivityType, CreateActivityInput, UpdateActivityInput } from '@/features/activities/types';
import { ACTIVITIES_ENDPOINT, ERROR_CODES } from '@/common/constants';
import { apiRequest } from '@/common/utils';

const prisma = new PrismaClient();

export const getActivities = async (userId: number): Promise<ActivityType[]> => {
  try {
    const activities = await prisma.activity.findMany({
      where: { userId },
    });
    return activities;
  } catch (error) {
    console.error('Error retrieving activities:', error);
    throw error;
  }
};

export const createActivity = async (
  activityData: CreateActivityInput,
  userId: number,
): Promise<ActivityType> => {
  try {
    const newActivity = await prisma.activity.create({
      data: {
        ...activityData,
        userId,
      },
    });
    return newActivity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

export const updateActivity = async (
  activityId: number,
  activityData: UpdateActivityInput,
): Promise<ActivityType> => {
  try {
    const updatedActivity = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: activityData,
    });
    return updatedActivity;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

export const deleteActivity = async (activityId: number): Promise<void> => {
  try {
    await prisma.activity.delete({
      where: {
        id: activityId,
      },
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};