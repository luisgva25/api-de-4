import express from 'express';
import productoController from '../controllers/Producto.controller.js';

const router = express.Router();

router.post('/', productoController.producto);
router.get('/', productoController.obtenerTodosLosProductos);
router.get('/:id', productoController.productoPorID);
router.patch('/:id', productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

export default router;
