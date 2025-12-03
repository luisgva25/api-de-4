import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  fechaCaducidad: {
    type: Date,
    required: true
  },
  fechaCompra: {
    type: Date,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  proveedor: {
    type: String,
    required: true
  },
  precioProducto: {
    type: Number,
    required: true
  },
  imagenUrl: {
    type: String,
    required: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Producto', productoSchema);
