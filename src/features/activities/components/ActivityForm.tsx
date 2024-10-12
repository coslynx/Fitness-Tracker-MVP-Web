import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Input, Button, Modal } from '@/components/common';
import { Activity, CreateActivityInput, UpdateActivityInput } from '@/features/activities/types';
import { 
  createActivity, 
  updateActivity,
  getActivities, 
  deleteActivity, 
} from '@/features/activities/services';
import { ERROR_CODES, SUCCESS_MESSAGES } from '@/common/constants';
import { useStore } from '@/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface ActivityFormProps {
  activity?: Activity;
  onClose: () => void;
}

const ActivityForm = ({ activity, onClose }: ActivityFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { activities, addActivity, updateActivities } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    type: yup
      .string()
      .required('Activity type is required')
      .oneOf(['running', 'cycling', 'swimming', 'weightlifting'], 'Invalid activity type'),
    date: yup.date().required('Date is required'),
    duration: yup
      .number()
      .required('Duration is required')
      .min(1, 'Duration must be at least 1 minute'),
    intensity: yup.string().optional(),
    caloriesBurned: yup.number().optional(),
    distance: yup.number().optional(),
    notes: yup.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateActivityInput | UpdateActivityInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: activity?.type || '',
      date: activity?.date || new Date(),
      duration: activity?.duration || 0,
      intensity: activity?.intensity || '',
      caloriesBurned: activity?.caloriesBurned || 0,
      distance: activity?.distance || 0,
      notes: activity?.notes || '',
    },
  });

  const onSubmit = async (data: CreateActivityInput | UpdateActivityInput) => {
    try {
      setIsLoading(true);
      if (activity) {
        const updatedActivity: Activity = await updateActivity(activity.id, data);
        updateActivities(updatedActivity);
        setErrorMessage(SUCCESS_MESSAGES.ACTIVITY_UPDATED);
        setShowModal(true);
        reset();
      } else {
        const newActivity: Activity = await createActivity(data, session?.user.id as number);
        addActivity(newActivity);
        setErrorMessage(SUCCESS_MESSAGES.ACTIVITY_CREATED);
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
            'An error occurred while saving the activity. Please try again later.'
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

  const handleDeleteActivity = async () => {
    try {
      if (activity) {
        setIsLoading(true);
        await deleteActivity(activity.id);
        updateActivities(activities.filter((a) => a.id !== activity.id));
        onClose();
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      setShowModal(true);
      setErrorMessage('An error occurred while deleting the activity.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2>{activity ? 'Edit Activity' : 'Add Activity'}</h2>
      <Input
        type="text"
        label="Activity Type"
        placeholder="e.g., Running"
        {...register('type')}
        error={errors.type?.message}
        required
      />
      <Input
        type="date"
        label="Date"
        {...register('date')}
        error={errors.date?.message}
        required
      />
      <Input
        type="number"
        label="Duration (minutes)"
        placeholder="e.g., 30"
        {...register('duration')}
        error={errors.duration?.message}
        required
      />
      <Input
        type="text"
        label="Intensity (Optional)"
        placeholder="e.g., Moderate"
        {...register('intensity')}
        error={errors.intensity?.message}
      />
      <Input
        type="number"
        label="Calories Burned (Optional)"
        placeholder="e.g., 200"
        {...register('caloriesBurned')}
        error={errors.caloriesBurned?.message}
      />
      <Input
        type="number"
        label="Distance (miles/km) (Optional)"
        placeholder="e.g., 3.5"
        {...register('distance')}
        error={errors.distance?.message}
      />
      <Input
        type="text"
        label="Notes (Optional)"
        placeholder="e.g., Beautiful trail run"
        {...register('notes')}
        error={errors.notes?.message}
      />
      {activity && (
        <Button type="button" onClick={handleDeleteActivity} danger>
          Delete Activity
        </Button>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : activity ? 'Save Changes' : 'Add Activity'}
      </Button>
      <Modal show={showModal} onClose={handleCloseModal} title="Success">
        <p>{errorMessage}</p>
      </Modal>
    </form>
  );
};

export default ActivityForm;