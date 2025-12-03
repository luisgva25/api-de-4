import express from 'express';
import { 
  registrarUsuario, 
  obtenerUsuarios, 
  obtenerUsuarioPorId, 
  actualizarUsuario, 
  eliminarUsuario,
  actualizarRolUsuario 
} from '../controllers/Usuario.controller.js';
import { verificarToken, esAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Ruta pública para registro de usuarios
router.post('/registro', registrarUsuario);

// Rutas protegidas (requieren autenticación)
router.get('/me', verificarToken, (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            usuario: req.usuario
        }
    });
});

// Rutas protegidas
router.get('/', verificarToken, esAdmin, obtenerUsuarios);
router.get('/:id', verificarToken, obtenerUsuarioPorId);
router.put('/:id', verificarToken, actualizarUsuario);
router.delete('/:id', verificarToken, esAdmin, eliminarUsuario);

// Ruta para actualizar el rol de un usuario (solo para administradores)
router.put('/:id/rol', verificarToken, esAdmin, actualizarRolUsuario);

export default router;
