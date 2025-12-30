import request from 'supertest';
import express from 'express';
import cors from 'cors';
import carRoutes from '../routes/cars';
import { createTestUser, generateTestToken, createTestCar, prisma } from './setup';

// Create test Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/cars', carRoutes);

describe('POST /api/cars - Create Car Listing', () => {
  let testUser: any;
  let testToken: string;

  beforeEach(async () => {
    // Create a test user and token before each test
    testUser = await createTestUser({
      email: 'seller@test.com',
      name: 'Test Seller',
      sellerType: 'private',
    });
    testToken = generateTestToken(testUser.id);
  });

  it('should create a car listing with valid data and auth token', async () => {
    const carData = {
      make: 'BMW',
      model: '3 Series',
      year: 2021,
      price: 35000,
      mileage: 25000,
      fuelType: 'diesel',
      transmission: 'automatic',
      location: 'Dublin',
      description: 'Excellent condition BMW 3 Series',
      photoUrls: ['https://example.com/photo1.jpg'],
    };

    const response = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${testToken}`)
      .send(carData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.make).toBe('BMW');
    expect(response.body.model).toBe('3 Series');
    expect(response.body.year).toBe(2021);
    expect(response.body.price).toBe(35000);
    expect(response.body.userId).toBe(testUser.id);

    // Verify car was actually saved in database
    const savedCar = await prisma.car.findUnique({
      where: { id: response.body.id },
    });
    expect(savedCar).not.toBeNull();
    expect(savedCar?.make).toBe('BMW');
  });

  it('should reject request without auth token (401)', async () => {
    const carData = {
      make: 'BMW',
      model: '3 Series',
      year: 2021,
      price: 35000,
    };

    const response = await request(app)
      .post('/api/cars')
      .send(carData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should reject request with invalid auth token (401)', async () => {
    const carData = {
      make: 'BMW',
      model: '3 Series',
      year: 2021,
      price: 35000,
    };

    const response = await request(app)
      .post('/api/cars')
      .set('Authorization', 'Bearer invalid-token-here')
      .send(carData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should reject request with missing required fields (400)', async () => {
    const incompleteData = {
      make: 'BMW',
      // Missing: model, year, price
    };

    const response = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${testToken}`)
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Missing required fields');
  });

  it('should handle car creation with minimal required fields', async () => {
    const minimalData = {
      make: 'Ford',
      model: 'Focus',
      year: 2019,
      price: 12000,
      mileage: 50000,
      fuelType: 'petrol',
      transmission: 'manual',
      description: 'Good car',
    };

    const response = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${testToken}`)
      .send(minimalData);

    expect(response.status).toBe(201);
    expect(response.body.make).toBe('Ford');
    expect(response.body.model).toBe('Focus');
  });

  it('should create car with empty photoUrls array by default', async () => {
    const carData = {
      make: 'Audi',
      model: 'A4',
      year: 2020,
      price: 30000,
      mileage: 35000,
      fuelType: 'diesel',
      transmission: 'automatic',
      description: 'Nice Audi',
    };

    const response = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${testToken}`)
      .send(carData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('photoUrls');
  });
});

describe('GET /api/cars - List Cars', () => {
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser();
    
    // Create some test cars
    await createTestCar(testUser.id, {
      make: 'BMW',
      model: '3 Series',
      year: 2021,
      price: 35000,
      location: 'Dublin',
    });
    
    await createTestCar(testUser.id, {
      make: 'Ford',
      model: 'Focus',
      year: 2019,
      price: 12000,
      location: 'Cork',
    });
  });

  it('should return list of all cars', async () => {
    const response = await request(app)
      .get('/api/cars');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('cars');
    expect(Array.isArray(response.body.cars)).toBe(true);
    expect(response.body.cars.length).toBe(2);
  });

  it('should filter cars by make', async () => {
    const response = await request(app)
      .get('/api/cars')
      .query({ make: 'BMW' });

    expect(response.status).toBe(200);
    expect(response.body.cars.length).toBe(1);
    expect(response.body.cars[0].make).toBe('BMW');
  });

  it('should filter cars by price range', async () => {
    const response = await request(app)
      .get('/api/cars')
      .query({ priceMin: 10000, priceMax: 20000 });

    expect(response.status).toBe(200);
    expect(response.body.cars.length).toBe(1);
    expect(response.body.cars[0].price).toBe(12000);
  });

  it('should filter cars by location', async () => {
    const response = await request(app)
      .get('/api/cars')
      .query({ location: 'Cork' });

    expect(response.status).toBe(200);
    expect(response.body.cars.length).toBe(1);
    expect(response.body.cars[0].location).toBe('Cork');
  });
});

describe('GET /api/cars/:id - Get Single Car', () => {
  let testUser: any;
  let testCar: any;

  beforeEach(async () => {
    testUser = await createTestUser();
    testCar = await createTestCar(testUser.id, {
      make: 'Mercedes',
      model: 'C-Class',
      year: 2022,
      price: 42000,
    });
  });

  it('should return single car by ID', async () => {
    const response = await request(app)
      .get(`/api/cars/${testCar.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testCar.id);
    expect(response.body.make).toBe('Mercedes');
    expect(response.body.model).toBe('C-Class');
  });

  it('should return 404 for non-existent car ID', async () => {
    const response = await request(app)
      .get('/api/cars/non-existent-id');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});

describe('GET /api/cars/user/listings - Get User Cars', () => {
  let testUser: any;
  let testToken: string;
  let otherUser: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'user1@test.com',
    });
    testToken = generateTestToken(testUser.id);

    otherUser = await createTestUser({
      email: 'user2@test.com',
    });

    // Create cars for test user
    await createTestCar(testUser.id, { make: 'BMW', model: 'X5' });
    await createTestCar(testUser.id, { make: 'Audi', model: 'Q7' });

    // Create car for other user
    await createTestCar(otherUser.id, { make: 'Ford', model: 'Fiesta' });
  });

  it('should return only authenticated user\'s cars', async () => {
    const response = await request(app)
      .get('/api/cars/user/listings')
      .set('Authorization', `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.cars.length).toBe(2);
    expect(response.body.cars.every((car: any) => car.userId === testUser.id)).toBe(true);
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .get('/api/cars/user/listings');

    expect(response.status).toBe(401);
  });
});
