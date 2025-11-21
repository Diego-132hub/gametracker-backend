import mongoose from 'mongoose';

const reseñaSchema = new mongoose.Schema({
  juegoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Juego',
    required: [true, 'El ID del juego es obligatorio']
  },
  titulo: {
    type: String,
    required: [true, 'El título de la reseña es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  contenido: {
    type: String,
    required: [true, 'El contenido de la reseña es obligatorio'],
    maxlength: [2000, 'La reseña no puede tener más de 2000 caracteres']
  },
  puntuacion: {
    type: Number,
    required: [true, 'La puntuación es obligatoria'],
    min: [1, 'La puntuación mínima es 1'],
    max: [5, 'La puntuación máxima es 5']
  },
  fechaReseña: {
    type: Date,
    default: Date.now
  },
  pros: [{
    type: String,
    trim: true
  }],
  contras: [{
    type: String,
    trim: true
  }],
  recomendado: {
    type: Boolean,
    default: true
  },
  horasJugadasParaReseña: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

// Índices
reseñaSchema.index({ juegoId: 1 });
reseñaSchema.index({ puntuacion: 1 });
reseñaSchema.index({ fechaReseña: -1 });

// Middleware para validar que el juego existe
reseñaSchema.pre('save', async function(next) {
  try {
    const Juego = mongoose.model('Juego');
    const juegoExists = await Juego.findById(this.juegoId);
    if (!juegoExists) {
      throw new Error('El juego asociado no existe');
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Reseña', reseñaSchema);
