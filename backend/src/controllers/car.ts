import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CarController {
  static async createCar(
    userId: string,
    data: {
      make: string;
      model: string;
      year: number;
      price: number;
      mileage: number;
      location?: string;
      fuelType: string;
      transmission: string;
      description: string;
      photoUrls?: string[];
    }
  ) {
    return await prisma.car.create({
      data: {
        ...data,
        userId,
        photoUrls: JSON.stringify(data.photoUrls || []),
      },
    });
  }

  static async getCars(filters?: {
    make?: string;
    model?: string;
    priceMin?: number;
    priceMax?: number;
    location?: string;
    fuelType?: string;
    userId?: string;
    skip?: number;
    take?: number;
  }) {
    const skip = filters?.skip || 0;
    const take = filters?.take || 20;

    return await prisma.car.findMany({
      where: {
        status: 'active',
        make: filters?.make ? { contains: filters.make } : undefined,
        model: filters?.model ? { contains: filters.model } : undefined,
        price: {
          gte: filters?.priceMin || 0,
          lte: filters?.priceMax || 999999,
        },
        location: filters?.location ? { contains: filters.location } : undefined,
        fuelType: filters?.fuelType ? { contains: filters.fuelType } : undefined,
        userId: filters?.userId || undefined,
      },
      include: { user: true },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCarById(id: string) {
    return await prisma.car.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  static async updateCar(
    id: string,
    userId: string,
    data: any
  ) {
    // Check ownership
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car || car.userId !== userId) {
      throw new Error('Not authorized');
    }

    return await prisma.car.update({
      where: { id },
      data,
    });
  }

  static async deleteCar(id: string, userId: string) {
    // Check ownership
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car || car.userId !== userId) {
      throw new Error('Not authorized');
    }

    return await prisma.car.delete({ where: { id } });
  }

  static async getUserCars(userId: string) {
    return await prisma.car.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAvailableMakes() {
    const cars = await prisma.car.findMany({
      where: { status: 'active' },
      select: { make: true },
      distinct: ['make'],
      orderBy: { make: 'asc' },
    });
    return cars.map(car => car.make);
  }

  static async getAvailableModels(make?: string) {
    const cars = await prisma.car.findMany({
      where: { 
        status: 'active',
        make: make || undefined,
      },
      select: { model: true },
      distinct: ['model'],
      orderBy: { model: 'asc' },
    });
    return cars.map(car => car.model);
  }
}
