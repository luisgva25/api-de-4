import Usuario from '../models/Usuario.model.js';
import jwt from 'jsonwebtoken';
import { config } from '../server.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, proporciona un correo y una contraseña'
      });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email }).select('+password');
    
    if (!usuario) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Verificar la contraseña
    const esContraseñaValida = await usuario.compararPassword(password);
    if (!esContraseñaValida) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Crear token JWT sin incluir el rol si es undefined
    const payload = { id: usuario._id };
    // Solo incluir el rol si existe y no es undefined
    if (usuario.rol !== undefined) {
      payload.rol = usuario.rol;
    }
    
    const token = jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // No enviar la contraseña en la respuesta
    const usuarioSinPassword = usuario.toObject();
    delete usuarioSinPassword.password;

    res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      data: {
        usuario: usuarioSinPassword,
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

export const verificarToken = async (req, res) => {
  try {
    // El middleware ya verificó el token y lo adjuntó a req.usuario
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        usuario
      }
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al verificar el token',
      error: error.message
    });
  }
};
