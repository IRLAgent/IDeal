/**
 * Seed script for IDeal.ie test data
 * Creates test users and car listings
 * 
 * Run with: npm run seed (after adding to package.json scripts)
 */

import axios from 'axios';

const API_URL = process.env.API_URL || 'https://ideal-production.up.railway.app/api';

interface SeedUser {
  email: string;
  password: string;
  name: string;
  phone: string;
  userType: 'seller' | 'dealer';
}

interface SeedCar {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  location: string;
  description: string;
  photoUrls: string[];
}

const TEST_USERS: SeedUser[] = [
  {
    email: 'seller1@ideal.ie',
    password: 'Password123!',
    name: 'Michael O\'Brien',
    phone: '+353851234567',
    userType: 'seller',
  },
  {
    email: 'seller2@ideal.ie',
    password: 'Password123!',
    name: 'Sarah Murphy',
    phone: '+353871234567',
    userType: 'seller',
  },
  {
    email: 'dealer1@ideal.ie',
    password: 'Password123!',
    name: 'Elite Motors Dublin',
    phone: '+353121234567',
    userType: 'dealer',
  },
];

const TEST_CARS: SeedCar[] = [
  {
    make: 'BMW',
    model: '3 Series',
    year: 2020,
    price: 24900,
    mileage: 45000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    location: 'Dublin',
    description:
      'Beautiful BMW 3 Series in excellent condition. Full service history, recently serviced. Leather interior, navigation system, parking sensors. A real gem for the serious buyer.',
    photoUrls: [
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&q=80&fm=jpg',
      'https://images.unsplash.com/photo-1554744512-d2c14487f7f1?w=800&q=80&fm=jpg',
    ],
  },
  {
    make: 'Ford',
    model: 'Focus',
    year: 2019,
    price: 16500,
    mileage: 62000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'Cork',
    description:
      'Reliable Ford Focus, perfect for daily commute. Good fuel economy, well-maintained by previous owner. New tyres and battery. MOT valid until 2025.',
    photoUrls: [
      'https://images.unsplash.com/photo-1535732066927-ab7c9ab60908?w=800&q=80&fm=jpg',
    ],
  },
  {
    make: 'Audi',
    model: 'A4',
    year: 2021,
    price: 32400,
    mileage: 28000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    location: 'Galway',
    description:
      'Premium Audi A4 with stunning design and performance. Nearly new condition, only 28k miles. Complete Audi service history. Virtual cockpit, panoramic sunroof, adaptive cruise control.',
    photoUrls: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80&fm=jpg',
    ],
  },
  {
    make: 'Volkswagen',
    model: 'Golf',
    year: 2018,
    price: 14900,
    mileage: 78000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'Limerick',
    description:
      'Solid VW Golf, fun to drive with responsive steering. Good condition, regular maintenance. Perfect first car or reliable runabout. Tax and MOT included.',
    photoUrls: [
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&q=80&fm=jpg',
    ],
  },
  {
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2019,
    price: 28500,
    mileage: 52000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    location: 'Belfast',
    description:
      'Luxury Mercedes C-Class in stunning black. Premium comfort and technology. Heated seats, keyless entry, DAB radio, reversing camera. A steal at this price!',
    photoUrls: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b83ad38?w=800&q=80&fm=jpg',
    ],
  },
  {
    make: 'Toyota',
    model: 'Yaris',
    year: 2017,
    price: 11400,
    mileage: 95000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Waterford',
    description:
      'Budget-friendly Toyota Yaris. Extremely reliable and economical. Perfect for city driving. Air conditioning, power steering, ABS brakes. No surprises, just honest motoring.',
    photoUrls: [
      'https://images.unsplash.com/photo-1579824343991-34c6eca3a0d1?w=800&q=80&fm=jpg',
    ],
  },
  {
    make: 'Hyundai',
    model: 'i30',
    year: 2020,
    price: 15800,
    mileage: 48000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'Wicklow',
    description:
      'Modern Hyundai i30 with great warranty coverage remaining. Stylish design with practical features. USB connectivity, touchscreen display, alloy wheels. Great value proposition.',
    photoUrls: [
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&q=80&fm=jpg',
    ],
  },
  {
    make: 'Peugeot',
    model: '308',
    year: 2019,
    price: 17200,
    mileage: 71000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    location: 'Donegal',
    description:
      'Attractive Peugeot 308 with smooth diesel engine. Recently had major service including new brake pads. Tinted windows, alloys, cruise control. Economical and fun.',
    photoUrls: [
      'https://images.unsplash.com/photo-1553882900-f2b06423ff1d?w=800&q=80&fm=jpg',
    ],
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  let userTokens: { email: string; token: string }[] = [];

  // Register test users
  console.log('👤 Creating test users...');
  for (const user of TEST_USERS) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email: user.email,
        password: user.password,
        name: user.name,
        phone: user.phone,
        userType: user.userType,
      });

      userTokens.push({
        email: user.email,
        token: response.data.token,
      });

      console.log(`  ✓ Created user: ${user.name}`);
    } catch (error: any) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log(`  ℹ User ${user.email} already exists`);
        // Try to log in if user exists
        try {
          const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: user.email,
            password: user.password,
          });
          userTokens.push({
            email: user.email,
            token: loginResponse.data.token,
          });
          console.log(`  ✓ Retrieved existing user token: ${user.name}`);
        } catch (loginError) {
          console.error(`  ✗ Could not login as ${user.email}`);
        }
      } else {
        console.error(
          `  ✗ Error creating user ${user.email}:`,
          error.response?.data?.message || error.message
        );
      }
    }
  }

  // Create test car listings
  console.log('\n🚗 Creating test car listings...');
  for (let i = 0; i < TEST_CARS.length; i++) {
    const car = TEST_CARS[i];
    const userToken = userTokens[i % userTokens.length]; // Distribute cars among users

    try {
      const response = await axios.post(
        `${API_URL}/cars`,
        {
          make: car.make,
          model: car.model,
          year: car.year,
          price: car.price,
          mileage: car.mileage,
          fuelType: car.fuelType,
          transmission: car.transmission,
          location: car.location,
          description: car.description,
          photoUrls: car.photoUrls,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken.token}`,
          },
        }
      );

      console.log(`  ✓ Created listing: ${car.year} ${car.make} ${car.model}`);
    } catch (error: any) {
      console.error(
        `  ✗ Error creating car listing (${car.make} ${car.model}):`,
        error.response?.data?.message || error.message
      );
    }
  }

  console.log('\n✅ Database seed complete!\n');
  console.log('Test users created:');
  TEST_USERS.forEach((user) => {
    console.log(`  📧 ${user.email} / Password: ${user.password}`);
  });
  console.log(`\nTotal listings created: ${TEST_CARS.length}`);
}

// Run the seed
seedDatabase().catch((error) => {
  console.error('❌ Seed failed:', error.message);
  process.exit(1);
});
