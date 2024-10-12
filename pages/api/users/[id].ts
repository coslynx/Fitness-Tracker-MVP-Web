import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { User } from '@/features/auth/types';
import { USERS_ENDPOINT } from '@/common/constants';
import { validateEmail } from '@/common/utils';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const user: User | null = await prisma.user.findUnique({
          where: { id: parseInt(id as string) },
        });

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, data: user });
      } catch (error) {
        console.error('Error retrieving user:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while retrieving the user.' });
      }
    case 'PUT':
      try {
        const { name, gender, age, weight } = req.body;

        const userId = parseInt(id as string);

        if (!validateEmail(req.body.email)) {
          return res.status(400).json({ success: false, message: 'Invalid email format.' });
        }

        const updatedUser: User = await prisma.user.update({
          where: { id: userId },
          data: {
            name,
            gender,
            age,
            weight,
          },
        });

        return res.status(200).json({ success: true, data: updatedUser });
      } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating the user profile.' });
      }
    case 'DELETE':
      try {
        await prisma.user.delete({
          where: { id: parseInt(id as string) },
        });

        return res.status(200).json({ success: true, message: 'User deleted successfully.' });
      } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while deleting the user.' });
      }
    default:
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}