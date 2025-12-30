import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class AuthController {
  static async register(
    email: string,
    password: string,
    name: string,
    phone?: string,
    sellerType: string = 'private'
  ) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        sellerType,
      },
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    console.log('🔑 Token generated for registration:', user.email);
    console.log('   JWT_SECRET used:', process.env.JWT_SECRET);
    console.log('   Token (first 20 chars):', token.substring(0, 20) + '...');

    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  static async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    console.log('🔑 Token generated for login:', user.email);
    console.log('   JWT_SECRET used:', process.env.JWT_SECRET);
    console.log('   Token (first 20 chars):', token.substring(0, 20) + '...');

    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }
}
