import mongoose from 'mongoose';

const juegoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  desarrolladora: {
    type: String,
    required: [true, 'La desarrolladora es obligatoria'],
    trim: true
  },
  genero: {
    type: String,
    required: [true, 'El género es obligatorio'],
    enum: ['Acción', 'Aventura', 'RPG', 'Estrategia', 'Deportes', 'Carreras', 'Shooter', 'Indie', 'Simulación', 'Terror', 'Plataformas', 'Lucha', 'Mundo abierto']
  },
  plataforma: {
    type: String,
    required: [true, 'La plataforma es obligatoria'],
    enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Multiplataforma']
  },
  añoLanzamiento: {
    type: Number,
    required: [true, 'El año de lanzamiento es obligatorio'],
    min: [1970, 'El año debe ser mayor a 1970'],
    max: [2030, 'El año no puede ser mayor a 2030']
  },
  portada: {
    type: String,
    default: ''
  },
  estado: {
    type: String,
    enum: ['Por jugar', 'Jugando', 'Completado', 'Abandonado'],
    default: 'Por jugar'
  },
  puntuacion: {
    type: Number,
    min: [0, 'La puntuación mínima es 0'],
    max: [5, 'La puntuación máxima es 5'],
    default: 0
  },
  horasJugadas: {
    type: Number,
    min: [0, 'Las horas jugadas no pueden ser negativas'],
    default: 0
  },
  fechaInicio: {
    type: Date
  },
  fechaFin: {
    type: Date
  },
  fechaAgregado: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para búsquedas más rápidas
juegoSchema.index({ titulo: 'text', desarrolladora: 'text' });
juegoSchema.index({ estado: 1 });
juegoSchema.index({ genero: 1 });

export default mongoose.model('Juego', juegoSchema);
