'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input, Button, Modal, Loader } from '@/components/common';
import { Goal, CreateGoalInput, UpdateGoalInput } from '@/features/goals/types';
import {
  createGoal,
  updateGoal,
  getGoals,
  deleteGoal,
} from '@/features/goals/services';
import { ERROR_CODES, SUCCESS_MESSAGES } from '@/common/constants';
import { useStore } from '@/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatDate } from '@/common/utils';

interface GoalFormProps {
  goal?: Goal;
  onClose: () => void;
}

const GoalForm = ({ goal, onClose }: GoalFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { goals, addGoal, updateGoals } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required('Goal name is required')
      .min(3, 'Goal name must be at least 3 characters'),
    target: yup
      .number()
      .required('Target is required')
      .min(1, 'Target must be at least 1'),
    timeframe: yup.string().required('Timeframe is required'),
    startDate: yup.date().required('Start date is required'),
    endDate: yup
      .date()
      .required('End date is required')
      .min(yup.ref('startDate'), 'End date must be after start date'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGoalInput | UpdateGoalInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: goal?.name || '',
      target: goal?.target || 0,
      timeframe: goal?.timeframe || 'weekly',
      startDate: goal?.startDate || new Date(),
      endDate: goal?.endDate || new Date(),
    },
  });

  const onSubmit = async (data: CreateGoalInput | UpdateGoalInput) => {
    try {
      setIsLoading(true);
      if (goal) {
        const updatedGoal: Goal = await updateGoal(goal.id, data);
        updateGoals(updatedGoal);
        setErrorMessage(SUCCESS_MESSAGES.GOAL_UPDATED);
        setShowModal(true);
        reset();
      } else {
        const newGoal: Goal = await createGoal(data, session?.user.id as number);
        addGoal(newGoal);
        setErrorMessage(SUCCESS_MESSAGES.GOAL_CREATED);
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
            'An error occurred while saving the goal. Please try again later.'
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

  const handleDeleteGoal = async () => {
    try {
      if (goal) {
        setIsLoading(true);
        await deleteGoal(goal.id);
        updateGoals(goals.filter((g) => g.id !== goal.id));
        onClose();
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      setShowModal(true);
      setErrorMessage('An error occurred while deleting the goal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2>{goal ? 'Edit Goal' : 'Create a New Goal'}</h2>
      <Input
        type="text"
        label="Goal Name"
        placeholder="e.g., Lose 10 lbs"
        {...register('name')}
        error={errors.name?.message}
        required
      />
      <Input
        type="number"
        label="Target"
        placeholder="e.g., 10"
        {...register('target')}
        error={errors.target?.message}
        required
      />
      <Input
        type="text"
        label="Timeframe"
        placeholder="e.g., Weekly"
        {...register('timeframe')}
        error={errors.timeframe?.message}
        required
      />
      <Input
        type="date"
        label="Start Date"
        {...register('startDate')}
        error={errors.startDate?.message}
        required
      />
      <Input
        type="date"
        label="End Date"
        {...register('endDate')}
        error={errors.endDate?.message}
        required
      />
      {goal && (
        <Button type="button" onClick={handleDeleteGoal} danger>
          Delete Goal
        </Button>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : goal ? 'Save Changes' : 'Create Goal'}
      </Button>
      <Modal show={showModal} onClose={handleCloseModal} title="Success">
        <p>{errorMessage}</p>
      </Modal>
    </form>
  );
};

const GoalList = () => {
  const { data: session } = useSession();
  const { goals, addGoal } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        if (session?.user.id) {
          const fetchedGoals = await getGoals(session.user.id);
          addGoal(fetchedGoals);
        }
      } catch (error) {
        setErrorMessage(
          'An error occurred while fetching goals. Please try again later.'
        );
        setShowModal(true);
        console.error('Error fetching goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [session, addGoal]);

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleDeleteGoal = async (goalId: number) => {
    try {
      await deleteGoal(goalId);
      updateGoals(goals.filter((g) => g.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      setErrorMessage('An error occurred while deleting the goal.');
      setShowModal(true);
    }
  };

  const handleCloseGoalForm = () => {
    setSelectedGoal(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2>Your Goals</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <ul className="list-disc">
            {goals.map((goal) => (
              <li key={goal.id}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3>{goal.name}</h3>
                    <p>
                      Target: {goal.target} {goal.units}
                      <br />
                      Start Date: {formatDate(goal.startDate)}
                      <br />
                      End Date: {formatDate(goal.endDate)}
                    </p>
                    <p>Progress: {goal.progress}%</p>
                  </div>
                  <div>
                    <Button
                      type="button"
                      onClick={() => handleEditGoal(goal)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleDeleteGoal(goal.id)}
                      danger
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <GoalForm goal={selectedGoal} onClose={handleCloseGoalForm} />
          <Modal show={showModal} onClose={handleCloseModal} title="Error">
            <p>{errorMessage}</p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default GoalList;