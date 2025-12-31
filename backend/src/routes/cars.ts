import { Router, Response } from 'express';
import { CarController } from '../controllers/car';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Get available makes (public)
router.get('/available/makes', async (req: AuthRequest, res: Response) => {
  try {
    const makes = await CarController.getAvailableMakes();
    res.json({ makes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get available models (public)
router.get('/available/models', async (req: AuthRequest, res: Response) => {
  try {
    const { make } = req.query;
    const models = await CarController.getAvailableModels(make as string);
    res.json({ models });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all cars (public)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    console.log('📥 Full request query:', req.query);
    console.log('📥 Request URL:', req.url);
    
    const { make, model, minPrice, maxPrice, location, fuelType, userId, skip, take } = req.query;
    
    const filters = {
      make: make as string,
      model: model as string,
      priceMin: minPrice ? parseInt(minPrice as string) : undefined,
      priceMax: maxPrice ? parseInt(maxPrice as string) : undefined,
      location: location as string,
      fuelType: fuelType as string,
      userId: userId as string,
      skip: skip ? parseInt(skip as string) : 0,
      take: take ? parseInt(take as string) : 20,
    };
    
    console.log('🔍 Search filters:', JSON.stringify(filters, null, 2));
    
    const cars = await CarController.getCars(filters);

    // Parse photoUrls JSON strings and filter out incomplete data
    const parsedCars = cars.map((car: any) => ({
      ...car,
      photoUrls: typeof car.photoUrls === 'string' ? JSON.parse(car.photoUrls) : car.photoUrls || [],
    }));

    res.json({ cars: parsedCars });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single car
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const car = await CarController.getCarById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Parse photoUrls JSON string
    const parsedCar = {
      ...car,
      photoUrls: typeof car.photoUrls === 'string' ? JSON.parse(car.photoUrls) : car.photoUrls || [],
    };

    res.json(parsedCar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create car (authenticated)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { make, model, year, price, mileage, location, fuelType, transmission, description, photoUrls } = req.body;

    if (!make || !model || !year || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const car = await CarController.createCar(req.userId!, {
      make,
      model,
      year,
      price,
      mileage,
      location,
      fuelType,
      transmission,
      description,
      photoUrls,
    });
    res.status(201).json(car);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's cars
router.get('/user/listings', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const cars = await CarController.getUserCars(req.userId!);
    const parsedCars = cars.map((car: any) => ({
      ...car,
      photoUrls: typeof car.photoUrls === 'string' ? JSON.parse(car.photoUrls) : car.photoUrls || [],
    }));
    res.json({ cars: parsedCars });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update car
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const car = await CarController.updateCar(req.params.id, req.userId!, req.body);
    res.json(car);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete car
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await CarController.deleteCar(req.params.id, req.userId!);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's cars
router.get('/user/listings', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const cars = await CarController.getUserCars(req.userId!);
    res.json(cars);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
