import { PrismaClient } from '@prisma/client';
import { Goal as GoalType } from '@/features/goals/types';
import { GOALS_ENDPOINT, ERROR_CODES } from '@/common/constants';
import { apiRequest } from '@/common/utils';

const prisma = new PrismaClient();

export const getGoals = async (userId: number): Promise<GoalType[]> => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId },
    });
    return goals;
  } catch (error) {
    console.error('Error retrieving goals:', error);
    throw error;
  }
};

export const createGoal = async (goalData: GoalType, userId: number): Promise<GoalType> => {
  try {
    const newGoal = await prisma.goal.create({
      data: {
        ...goalData,
        userId,
      },
    });
    return newGoal;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

export const updateGoal = async (goalId: number, goalData: GoalType): Promise<GoalType> => {
  try {
    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
      },
      data: goalData,
    });
    return updatedGoal;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

export const deleteGoal = async (goalId: number): Promise<void> => {
  try {
    await prisma.goal.delete({
      where: {
        id: goalId,
      },
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};