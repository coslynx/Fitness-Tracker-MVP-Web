import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Goal, CreateGoalInput, UpdateGoalInput } from '@/features/goals/types';
import { ERROR_CODES, SUCCESS_MESSAGES } from '@/common/constants';
import { validateGoalName, validateGoalTarget, validateGoalTimeframe, validateDate } from '@/common/utils';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const goals: Goal[] = await prisma.goal.findMany();
        return res.status(200).json({ success: true, data: goals });
      } catch (error) {
        console.error('Error retrieving goals:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while retrieving goals.' });
      }
    case 'POST':
      try {
        const { name, target, timeframe, startDate, endDate, units } = req.body;

        if (!validateGoalName(name)) {
          return res.status(400).json({ success: false, message: 'Invalid goal name.' });
        }

        if (!validateGoalTarget(target)) {
          return res.status(400).json({ success: false, message: 'Invalid goal target.' });
        }

        if (!validateGoalTimeframe(timeframe)) {
          return res.status(400).json({ success: false, message: 'Invalid goal timeframe.' });
        }

        if (!validateDate(new Date(startDate))) {
          return res.status(400).json({ success: false, message: 'Invalid start date.' });
        }

        if (!validateDate(new Date(endDate))) {
          return res.status(400).json({ success: false, message: 'Invalid end date.' });
        }

        const newGoal: Goal = await prisma.goal.create({
          data: {
            name,
            target,
            timeframe,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            units,
          },
        });

        return res.status(201).json({ success: true, data: newGoal, message: SUCCESS_MESSAGES.GOAL_CREATED });
      } catch (error) {
        console.error('Error creating goal:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while creating the goal.' });
      }
    case 'PUT':
      try {
        const goalId = parseInt(id as string);
        const { name, target, timeframe, startDate, endDate, units } = req.body;

        if (name && !validateGoalName(name)) {
          return res.status(400).json({ success: false, message: 'Invalid goal name.' });
        }

        if (target && !validateGoalTarget(target)) {
          return res.status(400).json({ success: false, message: 'Invalid goal target.' });
        }

        if (timeframe && !validateGoalTimeframe(timeframe)) {
          return res.status(400).json({ success: false, message: 'Invalid goal timeframe.' });
        }

        if (startDate && !validateDate(new Date(startDate))) {
          return res.status(400).json({ success: false, message: 'Invalid start date.' });
        }

        if (endDate && !validateDate(new Date(endDate))) {
          return res.status(400).json({ success: false, message: 'Invalid end date.' });
        }

        const updatedGoal: Goal = await prisma.goal.update({
          where: { id: goalId },
          data: {
            name,
            target,
            timeframe,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            units,
          },
        });

        return res.status(200).json({ success: true, data: updatedGoal, message: SUCCESS_MESSAGES.GOAL_UPDATED });
      } catch (error) {
        console.error('Error updating goal:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating the goal.' });
      }
    case 'DELETE':
      try {
        const goalId = parseInt(id as string);

        await prisma.goal.delete({
          where: { id: goalId },
        });

        return res.status(200).json({ success: true, message: 'Goal deleted successfully.' });
      } catch (error) {
        console.error('Error deleting goal:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while deleting the goal.' });
      }
    default:
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}