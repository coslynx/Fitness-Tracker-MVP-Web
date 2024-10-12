import { PrismaClient } from '@prisma/client';
import { User as UserType } from '@/features/auth/types'; 

const prisma = new PrismaClient();

export const User = {
  create: async (userData: UserType): Promise<UserType> => {
    try {
      const newUser = await prisma.user.create({
        data: userData,
      });
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user.');
    }
  },
  findById: async (id: number): Promise<UserType | null> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Failed to find user.');
    }
  },
  findByEmail: async (email: string): Promise<UserType | null> => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user.');
    }
  },
  update: async (id: number, updatedData: UserType): Promise<UserType> => {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updatedData,
      });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user.');
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user.');
    }
  },
};