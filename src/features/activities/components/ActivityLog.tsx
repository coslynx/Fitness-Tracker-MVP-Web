import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Activity } from '@/features/activities/types';
import { getActivities, deleteActivity } from '@/features/activities/services';
import { ActivityForm } from '@/features/activities/components';
import { Button, Loader, Modal } from '@/components/common';
import { useStore } from '@/store';
import { formatDate, formatTime } from '@/common/utils';

interface ActivityLogProps {
  activities: Activity[];
}

const ActivityLog = () => {
  const { data: session } = useSession();
  const { activities, addActivity, updateActivities } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (session?.user.id) {
          const fetchedActivities = await getActivities(session.user.id);
          addActivity(fetchedActivities);
        }
      } catch (error) {
        setErrorMessage(
          'An error occurred while fetching activities. Please try again later.'
        );
        setShowModal(true);
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [session, addActivity]);

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleDeleteActivity = async (activityId: number) => {
    try {
      await deleteActivity(activityId);
      updateActivities(activities.filter((a) => a.id !== activityId));
    } catch (error) {
      console.error('Error deleting activity:', error);
      setErrorMessage('An error occurred while deleting the activity.');
      setShowModal(true);
    }
  };

  const handleCloseActivityForm = () => {
    setSelectedActivity(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2>Your Activity Log</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <ul className="list-disc">
            {activities.map((activity) => (
              <li key={activity.id}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3>{activity.type}</h3>
                    <p>
                      {formatDate(activity.date)} -{' '}
                      {formatTime(activity.date)}
                    </p>
                    <p>
                      Duration: {activity.duration} minutes,{' '}
                      {activity.caloriesBurned ? (
                        `Calories burned: ${activity.caloriesBurned}`
                      ) : (
                        ''
                      )}
                    </p>
                  </div>
                  <div>
                    <Button
                      type="button"
                      onClick={() => handleEditActivity(activity)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleDeleteActivity(activity.id)}
                      danger
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <ActivityForm
            activity={selectedActivity}
            onClose={handleCloseActivityForm}
          />
          <Modal show={showModal} onClose={handleCloseModal} title="Error">
            <p>{errorMessage}</p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ActivityLog;