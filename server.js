import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import juegoRoutes from './routes/juegos.js';  // ← IMPORTANTE
import resenaRoutes from './routes/resenas.js'; // ← IMPORTANTE

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: ['https://diego-132hub.github.io', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// ✅ RUTAS CONFIGURADAS CORRECTAMENTE
app.use('/api/juegos', juegoRoutes);
app.use('/api/resenas', resenaRoutes);

// Ruta de prueba básica
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 GameTracker API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: ['/api/juegos', '/api/resenas', '/api/health']
  });
});

// Conexión a MongoDB y inicio del servidor
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 Base URL: http://localhost:${PORT}`);
    console.log(`🔗 Available routes:`);
    console.log(`   - GET /api/juegos`);
    console.log(`   - GET /api/resenas`);
    console.log(`   - GET /api/health`);
  });
};

startServer();
