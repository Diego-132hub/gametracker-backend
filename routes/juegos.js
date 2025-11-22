import express from 'express';
import {
  getJuegos,
  getJuegoById,
  createJuego,
  updateJuego,
  deleteJuego,
  getJuegosFiltrados
} from '../controllers/juegoController.js';

const router = express.Router();

// Rutas para juegos
router.get('/', getJuegos);
router.get('/filtros', getJuegosFiltrados);
router.get('/:id', getJuegoById);
router.post('/', createJuego);
router.put('/:id', updateJuego);
router.delete('/:id', deleteJuego);

export default router;
