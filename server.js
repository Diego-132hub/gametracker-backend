import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import corsMiddleware from './middleware/cors.js';
import errorHandler from './middleware/errorHandler.js';
import juegoRoutes from './routes/juegos.js';

// Importar rutas SIN caracteres especiales
// Si tu archivo se llama "reseñas.js", cámbialo a "resenas.js"
import resenaRoutes from './routes/resenas.js';

// Configurar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();
const PORT = process.env.PORT || 10000; // Cambié a 10000 para Render

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ✅ RUTAS PRINCIPALES - CON NOMBRES CORREGIDOS
app.use('/api/juegos', juegoRoutes);
app.use('/api/resenas', resenaRoutes); // Sin ñ

// ✅ RUTA DE PRUEBA MEJORADA
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎮 GameTracker API funcionando correctamente!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      juegos: '/api/juegos',
      resenas: '/api/resenas', // Sin ñ
      health: '/api/health'
    }
  });
});

// ✅ NUEVA RUTA HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
    availableRoutes: ['/', '/api/health', '/api/juegos', '/api/resenas']
  });
});

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 Servidor GameTracker iniciado!
📍 Puerto: ${PORT}
🌐 Entorno: ${process.env.NODE_ENV || 'development'}
🔗 URL: http://localhost:${PORT}
📊 MongoDB: Conectado a Atlas
📡 Endpoints disponibles:
   - GET / ✅
   - GET /api/health ✅  
   - GET /api/juegos ✅
   - GET /api/resenas ✅
  `);
});
