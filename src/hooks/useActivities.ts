import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Activity, CreateActivityInput, UpdateActivityInput } from '@/features/activities/types';
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from '@/features/activities/services';
import { ERROR_CODES, SUCCESS_MESSAGES } from '@/common/constants';
import { useStore } from '@/store';

const useActivities = () => {
  const { data: session } = useSession();
  const { activities, addActivity, updateActivities } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (session?.user.id) {
          const fetchedActivities: Activity[] = await getActivities(session.user.id);
          addActivity(fetchedActivities);
        }
      } catch (error: any) {
        setErrorMessage('An error occurred while fetching activities. Please try again later.');
        setShowModal(true);
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [session, addActivity]);

  const createOrUpdateActivity = async (
    activityData: CreateActivityInput | UpdateActivityInput,
    activityId?: number,
  ) => {
    try {
      setIsLoading(true);
      if (activityId) {
        const updatedActivity: Activity = await updateActivity(activityId, activityData);
        updateActivities(updatedActivity);
        setErrorMessage(SUCCESS_MESSAGES.ACTIVITY_UPDATED);
        setShowModal(true);
      } else {
        const newActivity: Activity = await createActivity(activityData, session?.user.id as number);
        addActivity(newActivity);
        setErrorMessage(SUCCESS_MESSAGES.ACTIVITY_CREATED);
        setShowModal(true);
      }
    } catch (error: any) {
      if (error.response?.status === ERROR_CODES.UNAUTHORIZED) {
        // Redirect to login if unauthorized
        // ...
      } else {
        setShowModal(true);
        setErrorMessage(error.response?.data?.message || 'An error occurred while saving the activity. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteActivityById = async (activityId: number) => {
    try {
      await deleteActivity(activityId);
      updateActivities(activities.filter((a) => a.id !== activityId));
    } catch (error: any) {
      setErrorMessage('An error occurred while deleting the activity.');
      setShowModal(true);
      console.error('Error deleting activity:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  return {
    activities,
    isLoading,
    createOrUpdateActivity,
    deleteActivityById,
    showModal,
    errorMessage,
    handleCloseModal,
  };
};

export default useActivities;