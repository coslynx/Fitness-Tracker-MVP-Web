import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Activity, CreateActivityInput, UpdateActivityInput } from '@/features/activities/types';
import { ERROR_CODES, SUCCESS_MESSAGES } from '@/common/constants';
import { validateActivityType, validateActivityDuration, validateDate } from '@/common/utils';

const prisma = new PrismaClient();

// Ensure the correct version of the 'next-auth' package is used
const nextAuthVersion = '4.24.8'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const activities: Activity[] = await prisma.activity.findMany();
        return res.status(200).json({ success: true, data: activities });
      } catch (error) {
        console.error('Error retrieving activities:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while retrieving activities.' });
      }
    case 'POST':
      try {
        const { type, date, duration, intensity, caloriesBurned, distance, notes } = req.body;
        const userId = parseInt(req.headers.userId as string);

        if (!validateActivityType(type)) {
          return res.status(400).json({ success: false, message: 'Invalid activity type.' });
        }

        if (!validateActivityDuration(duration)) {
          return res.status(400).json({ success: false, message: 'Invalid activity duration.' });
        }

        if (!validateDate(new Date(date))) {
          return res.status(400).json({ success: false, message: 'Invalid activity date.' });
        }

        const newActivity: Activity = await prisma.activity.create({
          data: {
            type,
            date: new Date(date),
            duration,
            intensity,
            caloriesBurned,
            distance,
            notes,
            userId,
          },
        });

        return res.status(201).json({ success: true, data: newActivity, message: SUCCESS_MESSAGES.ACTIVITY_CREATED });
      } catch (error) {
        console.error('Error creating activity:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while creating the activity.' });
      }
    case 'PUT':
      try {
        const activityId = parseInt(id as string);
        const { type, date, duration, intensity, caloriesBurned, distance, notes } = req.body;

        if (type && !validateActivityType(type)) {
          return res.status(400).json({ success: false, message: 'Invalid activity type.' });
        }

        if (duration && !validateActivityDuration(duration)) {
          return res.status(400).json({ success: false, message: 'Invalid activity duration.' });
        }

        if (date && !validateDate(new Date(date))) {
          return res.status(400).json({ success: false, message: 'Invalid activity date.' });
        }

        const updatedActivity: Activity = await prisma.activity.update({
          where: { id: activityId },
          data: {
            type: type ? type : undefined,
            date: date ? new Date(date) : undefined,
            duration: duration ? duration : undefined,
            intensity: intensity ? intensity : undefined,
            caloriesBurned: caloriesBurned ? caloriesBurned : undefined,
            distance: distance ? distance : undefined,
            notes: notes ? notes : undefined,
          },
        });

        return res.status(200).json({ success: true, data: updatedActivity, message: SUCCESS_MESSAGES.ACTIVITY_UPDATED });
      } catch (error) {
        console.error('Error updating activity:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating the activity.' });
      }
    case 'DELETE':
      try {
        const activityId = parseInt(id as string);

        await prisma.activity.delete({
          where: { id: activityId },
        });

        return res.status(200).json({ success: true, message: 'Activity deleted successfully.' });
      } catch (error) {
        console.error('Error deleting activity:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while deleting the activity.' });
      }
    default:
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}