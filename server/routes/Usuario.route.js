import express from 'express';
<<<<<<< HEAD
import { 
  registrarUsuario, 
  obtenerUsuarios, 
  obtenerUsuarioPorId, 
  actualizarUsuario, 
  eliminarUsuario,
  actualizarRolUsuario 
} from '../controllers/Usuario.controller.js';
=======
import { registrarUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario } from '../controllers/Usuario.controller.js';
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0
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

<<<<<<< HEAD
// Rutas protegidas
=======
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0
router.get('/', verificarToken, esAdmin, obtenerUsuarios);
router.get('/:id', verificarToken, obtenerUsuarioPorId);
router.put('/:id', verificarToken, actualizarUsuario);
router.delete('/:id', verificarToken, esAdmin, eliminarUsuario);

<<<<<<< HEAD
// Ruta para actualizar el rol de un usuario (solo para administradores)
router.put('/:id/rol', verificarToken, esAdmin, actualizarRolUsuario);

=======
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0
export default router;
