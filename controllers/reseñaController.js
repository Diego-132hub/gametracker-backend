import Reseña from '../models/Reseña.js';
import Juego from '../models/Juego.js';

// ✅ Obtener todas las reseñas
export const getReseñas = async (req, res) => {
  try {
    const reseñas = await Reseña.find()
      .populate('juegoId', 'titulo portada desarrolladora')
      .sort({ fechaReseña: -1 });

    res.json({
      success: true,
      count: reseñas.length,
      data: reseñas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las reseñas',
      error: error.message
    });
  }
};

// ✅ Obtener reseñas de un juego específico
export const getReseñasByJuego = async (req, res) => {
  try {
    const reseñas = await Reseña.find({ juegoId: req.params.juegoId })
      .populate('juegoId', 'titulo portada desarrolladora')
      .sort({ fechaReseña: -1 });

    res.json({
      success: true,
      count: reseñas.length,
      data: reseñas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las reseñas del juego',
      error: error.message
    });
  }
};

// ✅ Crear nueva reseña
export const createReseña = async (req, res) => {
  try {
    const reseña = new Reseña(req.body);
    const nuevaReseña = await reseña.save();
    
    // Popular los datos del juego para la respuesta
    await nuevaReseña.populate('juegoId', 'titulo portada desarrolladora');

    res.status(201).json({
      success: true,
      message: 'Reseña creada exitosamente',
      data: nuevaReseña
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la reseña',
      error: error.message
    });
  }
};

// ✅ Actualizar reseña
export const updateReseña = async (req, res) => {
  try {
    const reseña = await Reseña.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('juegoId', 'titulo portada desarrolladora');

    if (!reseña) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Reseña actualizada exitosamente',
      data: reseña
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar la reseña',
      error: error.message
    });
  }
};

// ✅ Eliminar reseña
export const deleteReseña = async (req, res) => {
  try {
    const reseña = await Reseña.findByIdAndDelete(req.params.id);

    if (!reseña) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Reseña eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la reseña',
      error: error.message
    });
  }
};

// ✅ Obtener estadísticas de reseñas
export const getReseñasStats = async (req, res) => {
  try {
    const totalReseñas = await Reseña.countDocuments();
    const avgPuntuacion = await Reseña.aggregate([
      { $group: { _id: null, avg: { $avg: '$puntuacion' } } }
    ]);
    
    const reseñasPorPuntuacion = await Reseña.aggregate([
      { $group: { _id: '$puntuacion', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const juegosMejorCalificados = await Reseña.aggregate([
      {
        $group: {
          _id: '$juegoId',
          avgPuntuacion: { $avg: '$puntuacion' },
          totalReseñas: { $sum: 1 }
        }
      },
      { $match: { totalReseñas: { $gte: 1 } } },
      { $sort: { avgPuntuacion: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'juegos',
          localField: '_id',
          foreignField: '_id',
          as: 'juegoInfo'
        }
      },
      { $unwind: '$juegoInfo' }
    ]);

    res.json({
      success: true,
      data: {
        totalReseñas,
        promedioPuntuacion: avgPuntuacion[0]?.avg || 0,
        distribucionPuntuaciones: reseñasPorPuntuacion,
        juegosMejorCalificados
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de reseñas',
      error: error.message
    });
  }
};
