import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Producto from './models/Producto.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/api4', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/productos', async (req, res) => {
  const producto = new Producto({
    nombre: req.body.nombre,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    fechaCaducidad: req.body.fechaCaducidad,
    fechaCompra: req.body.fechaCompra,
    stock: req.body.stock,
    proveedor: req.body.proveedor,
    precioProducto: req.body.precioProducto
  });

  try {
    const nuevoProducto = await producto.save();
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
