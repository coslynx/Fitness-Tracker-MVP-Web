import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ProgressData } from '@/features/progress/types';
import { getProgressData } from '@/features/progress/services';
import { Loader } from '@/components/common';
import { formatDate } from '@/common/utils';
import { useStore } from '@/store';

const ProgressLog = () => {
  const { data: session } = useSession();
  const { progressData, setProgressData } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        if (session?.user.id) {
          const data: ProgressData = await getProgressData(session.user.id);
          setProgressData(data);
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, [session, setProgressData]);

  return (
    <div className="flex flex-col gap-4">
      <h2>Your Progress Log</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {progressData.goals.map((goal) => (
            <div key={goal.id}>
              <h3>{goal.name}</h3>
              <p>
                Target: {goal.target} {goal.units}
                <br />
                Start Date: {formatDate(goal.startDate)}
                <br />
                End Date: {formatDate(goal.endDate)}
              </p>
              <p>
                Progress: {goal.progress}%
              </p>
            </div>
          ))}
          {progressData.activities.map((activity) => (
            <div key={activity.id}>
              <h3>{activity.type}</h3>
              <p>
                Date: {formatDate(activity.date)}
                <br />
                Duration: {activity.duration} minutes
                <br />
                Calories burned: {activity.caloriesBurned}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ProgressLog;