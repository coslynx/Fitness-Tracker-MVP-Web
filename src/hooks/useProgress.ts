import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ProgressData } from '@/features/progress/types';
import { getProgressData } from '@/features/progress/services';
import { Loader } from '@/components/common';
import { formatDate } from '@/common/utils';
import { useStore } from '@/store';

const useProgress = () => {
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

  return {
    progressData,
    isLoading,
  };
};

export default useProgress;