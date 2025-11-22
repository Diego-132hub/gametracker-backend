import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jovenescreativos:AngjYhQeY0KpTLuR@proyecto-final-jc.yhgniab.mongodb.net/diegogarcia';

const connectDB = async () => {
  try {
    // Opciones mejoradas para producción
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout después de 5s
      socketTimeoutMS: 45000, // Cierra sockets después de 45s
    });

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    // En producción, salir con error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

mongoose.connection.on('error', err => {
  console.error('❌ Error de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB desconectado');
});

export default connectDB;
