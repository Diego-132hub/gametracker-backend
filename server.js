import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: ['https://diego-132hub.github.io', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Ruta de prueba PRIMERO
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

// Importar y usar rutas (con manejo de errores)
try {
  const juegoRoutes = await import('./routes/juegos.js');
  const resenaRoutes = await import('./routes/resenas.js');
  
  app.use('/api/juegos', juegoRoutes.default);
  app.use('/api/resenas', resenaRoutes.default);
  
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error);
}

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: ['/', '/api/health', '/api/juegos', '/api/resenas']
  });
});

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
};

// Iniciar servidor
const startServer = async () => {
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.log('⚠️ Starting server without MongoDB connection');
  }

  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 Base URL: http://localhost:${PORT}`);
    console.log('✅ Server started successfully!');
  });
};

startServer();
