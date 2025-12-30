const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const carCount = await prisma.car.count();
    const userCount = await prisma.user.count();
    
    console.log('=== Database Status ===');
    console.log('Users:', userCount);
    console.log('Cars:', carCount);
    
    if (carCount > 0) {
      const cars = await prisma.car.findMany({ take: 3 });
      console.log('\nFirst few cars:');
      cars.forEach(car => {
        console.log(`- ${car.year} ${car.make} ${car.model} - €${car.price}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
