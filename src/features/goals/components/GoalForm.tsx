import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Input, Button, Modal } from '@/components/common';
import { Goal, CreateGoalInput } from '@/features/goals/types';
import { createGoal } from '@/features/goals/services';
import { ERROR_CODES, SUCCESS_MESSAGES } from '@/common/constants';
import { useStore } from '@/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const GoalForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { goals, addGoal } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
  } = useForm<CreateGoalInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: CreateGoalInput) => {
    try {
      const newGoal: Goal = await createGoal(data, session?.user.id as number);
      addGoal(newGoal);
      reset();
      setShowModal(true);
      setErrorMessage(SUCCESS_MESSAGES.GOAL_CREATED);
    } catch (error: any) {
      if (error.response?.status === ERROR_CODES.UNAUTHORIZED) {
        router.push('/auth/login');
      } else {
        setShowModal(true);
        setErrorMessage(
          error.response?.data?.message ||
            'An error occurred while creating the goal. Please try again later.'
        );
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2>Create a New Goal</h2>
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
      <Button type="submit">Create Goal</Button>
      <Modal show={showModal} onClose={handleCloseModal} title="Success">
        <p>{errorMessage}</p>
      </Modal>
    </form>
  );
};

export default GoalForm;