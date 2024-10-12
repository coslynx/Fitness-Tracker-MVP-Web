import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Goal } from '@/features/goals/types';
import { getGoals } from '@/features/goals/services';
import { GoalForm } from '@/features/goals/components';
import { Button, Loader, Modal } from '@/components/common';
import { useStore } from '@/store';

interface GoalListProps {
  goals: Goal[];
}

const GoalList = () => {
  const { data: session } = useSession();
  const { goals, addGoal } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  return (
    <div className="flex flex-col gap-4">
      <h2>Your Goals</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <ul className="list-disc">
            {goals.map((goal) => (
              <li key={goal.id}>{goal.name}</li>
            ))}
          </ul>
          <GoalForm />
          <Modal show={showModal} onClose={handleCloseModal} title="Error">
            <p>{errorMessage}</p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default GoalList;