'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Input,
  Button,
  Modal,
  Loader,
  GoalList,
  ActivityLog,
  ProgressChart,
  UserProfile,
} from '@/components/common';
import {
  Goal,
  CreateGoalInput,
  UpdateGoalInput,
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
  UserProfile as UserProfileType,
} from '@/features/auth/types';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getUserProfile,
  updateUserProfile,
} from '@/features/auth/services';
import { ERROR_CODES, SUCCESS_MESSAGES } from '@/common/constants';
import { useStore } from '@/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatDate, formatTime } from '@/common/utils';
import { ProgressData } from '@/features/progress/types';
import { getProgressData } from '@/features/progress/services';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LineController,
  LineElement,
  PointElement,
  Title,
} from 'chart.js';

Chart.register(CategoryScale, LineController, LineElement, PointElement, Title);

const Dashboard = () => {
  const { data: session } = useSession();
  const {
    goals,
    addGoal,
    activities,
    addActivity,
    userProfile,
    setUserProfile,
    progressData,
    setProgressData,
  } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session?.user.id) {
          const fetchedGoals = await getGoals(session.user.id);
          addGoal(fetchedGoals);
          const fetchedActivities = await getActivities(session.user.id);
          addActivity(fetchedActivities);
          const fetchedUserProfile: UserProfileType = await getUserProfile(
            session.user.id
          );
          setUserProfile(fetchedUserProfile);
          const fetchedProgressData: ProgressData =
            await getProgressData(session.user.id);
          setProgressData(fetchedProgressData);
        }
      } catch (error) {
        setErrorMessage(
          'An error occurred while fetching data. Please try again later.'
        );
        setShowModal(true);
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, addGoal, addActivity, setUserProfile, setProgressData]);

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
      addGoal(goals.filter((g) => g.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      setErrorMessage('An error occurred while deleting the goal.');
      setShowModal(true);
    }
  };

  const handleCloseGoalForm = () => {
    setSelectedGoal(null);
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleDeleteActivity = async (activityId: number) => {
    try {
      await deleteActivity(activityId);
      addActivity(activities.filter((a) => a.id !== activityId));
    } catch (error) {
      console.error('Error deleting activity:', error);
      setErrorMessage('An error occurred while deleting the activity.');
      setShowModal(true);
    }
  };

  const handleCloseActivityForm = () => {
    setSelectedActivity(null);
  };

  const chartData = {
    labels: progressData.activities.map((activity) =>
      formatDate(activity.date)
    ),
    datasets: [
      {
        label: 'Weight Loss Progress',
        data: progressData.activities.map((activity) =>
          activity.caloriesBurned ? activity.caloriesBurned : 0
        ),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Your Progress Over Time',
      },
    },
  };

  return (
    <div className="flex flex-col gap-4">
      <h2>Your Dashboard</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h3>Your Goals</h3>
              <GoalList goals={goals} />
            </div>
            <div>
              <h3>Your Activity Log</h3>
              <ActivityLog activities={activities} />
            </div>
            <div>
              <h3>Your Progress</h3>
              <ProgressChart data={chartData} options={chartOptions} />
            </div>
          </div>
          <div className="mt-4">
            <h3>Your Profile</h3>
            <UserProfile userProfile={userProfile} />
          </div>
          <Modal show={showModal} onClose={handleCloseModal} title="Error">
            <p>{errorMessage}</p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Dashboard;