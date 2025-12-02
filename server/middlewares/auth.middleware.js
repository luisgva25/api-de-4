import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.model.js';
import { config } from '../server.js';

// Middleware para verificar el token JWT
export const verificarToken = async (req, res, next) => {
  try {
    // Obtener el token del header de autorización
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Acceso denegado. No se proporcionó token de autenticación.'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Buscar al usuario en la base de datos
    const usuario = await Usuario.findById(decoded.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    // Agregar el usuario al objeto de solicitud
    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error en verificarToken:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido',
        error: error.message
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expirado',
        error: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Error en la autenticación',
      error: error.message
    });
  }
};

// Middleware para verificar si el usuario es administrador
export const esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Acceso denegado. Se requieren privilegios de administrador.'
    });
  }
  next();
};

// Middleware para verificar si el usuario es el propietario del recurso o admin
export const esPropietarioOAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin' && req.usuario.id !== req.params.id) {
    return res.status(403).json({
      status: 'error',
      message: 'No tienes permiso para realizar esta acción.'
    });
  }
  next();
};
