import { Router } from 'express';
import { login, verificarToken } from '../controllers/Auth.controller.js';

const router = Router();

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para verificar el token
router.get('/verify', verificarToken);

export default router;
