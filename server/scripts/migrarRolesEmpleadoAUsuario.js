import mongoose from 'mongoose';
import Usuario from '../models/Usuario.model.js';

// URI de conexión (usa la misma que en server.js)
const MONGODB_URI = 'mongodb://localhost:27017/api4';

async function migrarRoles() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Migrando usuarios con rol 'empleado' a 'usuario'...");
    const resultado = await Usuario.updateMany(
      { rol: 'empleado' },
      { $set: { rol: 'usuario' } }
    );

    console.log('Documentos modificados:', resultado.modifiedCount ?? resultado.nModified);
    console.log('Migración completada.');
  } catch (error) {
    console.error('Error durante la migración de roles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Conexión a MongoDB cerrada.');
  }
}

migrarRoles();
