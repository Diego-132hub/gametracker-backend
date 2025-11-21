import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://jovenescreativos:AngjYhQeY0KpTLuR@proyecto-final-jc.yhgniab.mongodb.net/diegogarcia';

async function testConnection() {
  try {
    console.log('🔗 Intentando conectar a MongoDB Atlas...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
    console.log(`🏠 Host: ${mongoose.connection.host}`);
    
    // Verificar si hay colecciones existentes
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📂 Colecciones existentes: ${collections.length}`);
    
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });

    mongoose.connection.close();
    console.log('🔌 Conexión cerrada');

  } catch (error) {
    console.error('❌ Error en la conexión:', error.message);
    process.exit(1);
  }
}

testConnection();
