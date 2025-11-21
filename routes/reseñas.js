import express from 'express';
import {
  getReseñas,
  getReseñasByJuego,
  createReseña,
  updateReseña,
  deleteReseña,
  getReseñasStats
} from '../controllers/reseñaController.js';

const router = express.Router();

// Rutas para reseñas
router.get('/', getReseñas);                    // Obtener todas las reseñas
router.get('/estadisticas', getReseñasStats);   // Estadísticas de reseñas
router.get('/juego/:juegoId', getReseñasByJuego); // Reseñas por juego
router.post('/', createReseña);                 // Crear nueva reseña
router.put('/:id', updateReseña);               // Actualizar reseña
router.delete('/:id', deleteReseña);            // Eliminar reseña

export default router;
