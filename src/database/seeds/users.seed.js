import { PrismaClient } from '@prisma/client';
import { User } from '@/features/auth/types';

const prisma = new PrismaClient();

const usersSeedData: User[] = [
  {
    email: 'admin@example.com',
    password: 'password123',
    username: 'admin',
    name: 'Admin User',
    gender: 'Male',
    age: 30,
    weight: 180,
  },
  {
    email: 'john.doe@example.com',
    password: 'password456',
    username: 'johndoe',
    name: 'John Doe',
    gender: 'Male',
    age: 25,
    weight: 165,
  },
  {
    email: 'jane.doe@example.com',
    password: 'password789',
    username: 'janedoe',
    name: 'Jane Doe',
    gender: 'Female',
    age: 28,
    weight: 130,
  },
];

async function seedUsers() {
  try {
    await prisma.user.createMany({
      data: usersSeedData,
      skipDuplicates: true,
    });
    console.log('Seeded user data successfully!');
  } catch (error) {
    console.error('Error seeding user data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();