import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables and OVERRIDE any existing ones
dotenv.config({ path: path.resolve(__dirname, '../../.env.test'), override: true });

// SAFETY CHECK: Ensure we're using test database
if (!process.env.DATABASE_URL?.includes('test.db')) {
  throw new Error(
    `❌ SAFETY CHECK FAILED: Tests must use test.db, but DATABASE_URL is: ${process.env.DATABASE_URL}\n` +
    'This prevents accidentally clearing your development database!'
  );
}

console.log('✅ Test database confirmed:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

/**
 * Reset database before all tests
 */
beforeAll(async () => {
  // Clean up existing test data
  await prisma.message.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.car.deleteMany({});
  await prisma.user.deleteMany({});
});

/**
 * Close database connection after all tests
 */
afterAll(async () => {
  await prisma.$disconnect();
});

/**
 * Clean up data after each test
 */
afterEach(async () => {
  await prisma.message.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.car.deleteMany({});
  await prisma.user.deleteMany({});
});

/**
 * Helper: Create a test user in the database
 */
export async function createTestUser(userData?: {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  sellerType?: string;
}) {
  const hashedPassword = await bcrypt.hash(userData?.password || 'TestPass123!', 10);
  
  return await prisma.user.create({
    data: {
      email: userData?.email || 'test@example.com',
      password: hashedPassword,
      name: userData?.name || 'Test User',
      phone: userData?.phone || '+353871234567',
      sellerType: userData?.sellerType || 'private',
    },
  });
}

/**
 * Helper: Generate valid JWT token for testing
 */
export function generateTestToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'test-jwt-secret-for-testing-only',
    { expiresIn: '24h' }
  );
}

/**
 * Helper: Create a test car in the database
 */
export async function createTestCar(userId: string, carData?: Partial<any>) {
  return await prisma.car.create({
    data: {
      userId,
      make: carData?.make || 'Toyota',
      model: carData?.model || 'Corolla',
      year: carData?.year || 2020,
      price: carData?.price || 15000,
      mileage: carData?.mileage || 50000,
      fuelType: carData?.fuelType || 'petrol',
      transmission: carData?.transmission || 'manual',
      location: carData?.location || 'Dublin',
      description: carData?.description || 'Test car description',
      photoUrls: carData?.photoUrls ? JSON.stringify(carData.photoUrls) : JSON.stringify([]),
      status: carData?.status || 'active',
    },
  });
}

export { prisma };
