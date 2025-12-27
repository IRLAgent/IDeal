import { Router, Response } from 'express';
import { CarController } from '../controllers/car';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Get all cars (public)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { make, model, priceMin, priceMax, skip, take } = req.query;
    const cars = await CarController.getCars({
      make: make as string,
      model: model as string,
      priceMin: priceMin ? parseInt(priceMin as string) : undefined,
      priceMax: priceMax ? parseInt(priceMax as string) : undefined,
      skip: skip ? parseInt(skip as string) : 0,
      take: take ? parseInt(take as string) : 20,
    });
    res.json(cars);
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
    res.json(car);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create car (authenticated)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { make, model, year, price, mileage, fuelType, transmission, description, photoUrls } = req.body;

    if (!make || !model || !year || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const car = await CarController.createCar(req.userId!, {
      make,
      model,
      year,
      price,
      mileage,
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
