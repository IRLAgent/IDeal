import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import carRoutes from './routes/cars';
import messageRoutes from './routes/messages';
import uploadRoutes from './routes/upload';

// Debug: Log environment variable status at startup
console.log('🚀 Starting IDeal.ie Backend API');
console.log('📋 Environment Check:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   PORT:', process.env.PORT);
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Missing');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'undefined');
console.log('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || 'undefined');
console.log('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET || 'undefined');
console.log('   All env keys:', Object.keys(process.env).filter(k => k.includes('CLOUDINARY') || k.includes('DATABASE') || k.includes('JWT')));
console.log('   Total env vars:', Object.keys(process.env).length);
console.log('');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'https://ideal-production.up.railway.app',
    'https://i-deal-cars.vercel.app',
    'https://i-deal.ie',
    'https://www.i-deal.ie',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   CarMarket.ie Backend Server          ║
╠════════════════════════════════════════╣
║   ✅ Server running                    ║
║   📝 Port: ${PORT}                        ║
║   🏠 Health: /api/health               ║
║   📚 API Routes:                       ║
║      - /api/auth (register, login)    ║
║      - /api/cars (list, create)       ║
║      - /api/messages (send, receive)  ║
╚════════════════════════════════════════╝
  `);
});
