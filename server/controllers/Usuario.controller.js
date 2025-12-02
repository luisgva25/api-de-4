import Usuario from "../models/Usuario.model.js";
import jwt from 'jsonwebtoken';
import { config } from '../server.js';

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        status: 'error',
        message: 'El correo electrónico ya está registrado'
      });
    }

    // Crear nuevo usuario sin especificar el rol
    // No incluimos el campo 'rol' para que no se establezca ningún valor por defecto
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password
      // No incluimos el campo 'rol' para que quede completamente indefinido
    });

    // Guardar usuario en la base de datos
    const usuarioGuardado = await nuevoUsuario.save();

    // Crear token JWT sin incluir el rol si es undefined
    const payload = { id: usuarioGuardado._id };
    // Solo incluir el rol si existe y no es undefined
    if (usuarioGuardado.rol !== undefined) {
      payload.rol = usuarioGuardado.rol;
    }
    
    const token = jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // No enviar la contraseña en la respuesta
    const { password: _, ...usuarioSinPassword } = usuarioGuardado._doc;

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: {
        usuario: usuarioSinPassword,
        token
      }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al registrar el usuario',
      error: error.message
    });
  }
};

// Obtener todos los usuarios (solo para administradores)
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.status(200).json({
      status: 'success',
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los usuarios',
      error: error.message
    });
  }
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }
    res.status(200).json({
      status: 'success',
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener el usuario',
      error: error.message
    });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    // Verificar si el usuario existe
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos
    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;
    if (rol && req.usuario.rol === 'admin') {
      usuario.rol = rol;
    }

    const usuarioActualizado = await usuario.save();
    const { password, ...usuarioSinPassword } = usuarioActualizado._doc;

    res.status(200).json({
      status: 'success',
      message: 'Usuario actualizado exitosamente',
      data: usuarioSinPassword
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el usuario',
      error: error.message
    });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    // No permitir que un usuario se elimine a sí mismo
    if (req.usuario.id === id) {
      return res.status(400).json({
        status: 'error',
        message: 'No puedes eliminar tu propia cuenta'
      });
    }

    await Usuario.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el usuario',
      error: error.message
    });
  }
};
