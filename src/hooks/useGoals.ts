'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Goal, CreateGoalInput, UpdateGoalInput } from '@/features/goals/types';
import { 
  getGoals, 
  createGoal, 
  updateGoal, 
  deleteGoal, 
} from '@/features/goals/services';
import { ERROR_CODES, SUCCESS_MESSAGES } from '@/common/constants';
import { useStore } from '@/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const useGoals = () => {
  const { data: session } = useSession();
  const { goals, addGoal, updateGoals } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        if (session?.user.id) {
          const fetchedGoals: Goal[] = await getGoals(session.user.id);
          addGoal(fetchedGoals);
        }
      } catch (error: any) {
        setErrorMessage('An error occurred while fetching goals. Please try again later.');
        setShowModal(true);
        console.error('Error fetching goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [session, addGoal]);

  const createOrUpdateGoal = async (
    goalData: CreateGoalInput | UpdateGoalInput,
    goalId?: number,
  ) => {
    try {
      setIsLoading(true);
      if (goalId) {
        const updatedGoal: Goal = await updateGoal(goalId, goalData);
        updateGoals(updatedGoal);
        setErrorMessage(SUCCESS_MESSAGES.GOAL_UPDATED);
        setShowModal(true);
      } else {
        const newGoal: Goal = await createGoal(goalData, session?.user.id as number);
        addGoal(newGoal);
        setErrorMessage(SUCCESS_MESSAGES.GOAL_CREATED);
        setShowModal(true);
      }
    } catch (error: any) {
      if (error.response?.status === ERROR_CODES.UNAUTHORIZED) {
        // Redirect to login if unauthorized
        // ...
      } else {
        setShowModal(true);
        setErrorMessage(error.response?.data?.message || 'An error occurred while saving the goal. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGoalById = async (goalId: number) => {
    try {
      await deleteGoal(goalId);
      updateGoals(goals.filter((g) => g.id !== goalId));
    } catch (error: any) {
      setErrorMessage('An error occurred while deleting the goal.');
      setShowModal(true);
      console.error('Error deleting goal:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleCloseGoalForm = () => {
    setSelectedGoal(null);
  };

  return {
    goals,
    isLoading,
    createOrUpdateGoal,
    deleteGoalById,
    showModal,
    errorMessage,
    handleCloseModal,
    handleEditGoal,
    handleCloseGoalForm,
    selectedGoal,
  };
};

export default useGoals;