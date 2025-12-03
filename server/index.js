import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import productoRoutes from './routes/Producto.route.js';
import swaggerUi from 'swagger-ui-express';
import { readFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static para servir imágenes subidas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, 'uploads');
mkdirSync(uploadPath, { recursive: true });
app.use('/uploads', express.static(uploadPath));

// Conexión a MongoDB (opcional - el servidor funciona sin ella)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/api4';
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.warn('⚠️ MongoDB no disponible:', err.message));

// Swagger (opcional) - busca ../swagger.json
try {
  const swaggerPath = new URL('../swagger.json', import.meta.url);
  const swaggerDocument = JSON.parse(readFileSync(swaggerPath, 'utf8'));
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Ruta de documentación disponible en /doc');
} catch (err) {
  // no hay swagger.json — no exponemos /doc
}

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

// Rutas
app.use('/api/productos', productoRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
