import express from 'express';
import {
  getJuegos,
  getJuegoById,
  createJuego,
  updateJuego,
  deleteJuego,
  getEstadisticas
} from '../controllers/juegoController.js';

const router = express.Router();

// Rutas para juegos
router.get('/', getJuegos);           // Obtener todos los juegos
router.get('/estadisticas', getEstadisticas); // Estadísticas
router.get('/:id', getJuegoById);     // Obtener juego por ID
router.post('/', createJuego);        // Crear nuevo juego
router.put('/:id', updateJuego);      // Actualizar juego
router.delete('/:id', deleteJuego);   // Eliminar juego

export default router;
