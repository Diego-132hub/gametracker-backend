import mongoose from 'mongoose';
import Juego from '../models/Juego.js';
import Reseña from '../models/Reseña.js';

const MONGODB_URI = 'mongodb+srv://jovenescreativos:AngjYhQeY0KpTLuR@proyecto-final-jc.yhgniab.mongodb.net/diegogarcia';

const juegosEjemplo = [
  {
    titulo: 'The Legend of Zelda: Breath of the Wild',
    desarrolladora: 'Nintendo',
    genero: 'Aventura',
    plataforma: 'Nintendo Switch',
    añoLanzamiento: 2017,
    estado: 'Completado',
    puntuacion: 5,
    horasJugadas: 85,
    portada: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wya.jpg'
  },
  {
    titulo: 'Red Dead Redemption 2',
    desarrolladora: 'Rockstar Games',
    genero: 'Mundo abierto',
    plataforma: 'PlayStation',
    añoLanzamiento: 2018,
    estado: 'Jugando',
    puntuacion: 5,
    horasJugadas: 45,
    portada: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1rbo.jpg'
  },
  {
    titulo: 'Hollow Knight',
    desarrolladora: 'Team Cherry',
    genero: 'Metroidvania',
    plataforma: 'PC',
    añoLanzamiento: 2017,
    estado: 'Completado',
    puntuacion: 4,
    horasJugadas: 32,
    portada: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1nxb.jpg'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar base de datos existente
    await Juego.deleteMany({});
    await Reseña.deleteMany({});
    console.log('✅ Base de datos limpiada');

    // Insertar juegos de ejemplo
    const juegosCreados = await Juego.insertMany(juegosEjemplo);
    console.log(`✅ ${juegosCreados.length} juegos insertados`);

    console.log('🎉 Base de datos poblada exitosamente!');
    console.log('📊 Puedes ver los datos en: http://localhost:5000/api/juegos');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

seedDatabase();
