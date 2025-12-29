import dotenv from 'dotenv';

// Load environment variables FIRST, before any other imports that might need them
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import carRoutes from './routes/cars';
import messageRoutes from './routes/messages';
import uploadRoutes from './routes/upload';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'https://ideal-production.up.railway.app',
    'https://i-deal-cars.vercel.app',
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
