import express from 'express';
import { registrarUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario } from '../controllers/Usuario.controller.js';
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

router.get('/', verificarToken, esAdmin, obtenerUsuarios);
router.get('/:id', verificarToken, obtenerUsuarioPorId);
router.put('/:id', verificarToken, actualizarUsuario);
router.delete('/:id', verificarToken, esAdmin, eliminarUsuario);

export default router;
