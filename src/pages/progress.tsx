'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ProgressData } from '@/features/progress/types';
import { getProgressData } from '@/features/progress/services';
import { Loader } from '@/components/common';
import { formatDate } from '@/common/utils';
import { useStore } from '@/store';
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

const ProgressChart = () => {
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
      <h2>Your Progress</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default ProgressChart;