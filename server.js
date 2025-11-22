import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import corsMiddleware from './middleware/cors.js';
import errorHandler from './middleware/errorHandler.js';
import juegoRoutes from './routes/juegos.js';
import reseñaRoutes from './routes/reseñas.js';

// Configurar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas principales
app.use('/api/juegos', juegoRoutes);
app.use('/api/reseñas', reseñaRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🎮 GameTracker API funcionando correctamente!',
    version: '1.0.0',
    endpoints: {
      juegos: '/api/juegos',
      reseñas: '/api/reseñas',
      documentación: 'Próximamente...'
    }
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
});

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor GameTracker iniciado!`);
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://${PORT}/api`);
});

// Manejo graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('🔌 Process terminated');
  });
});
