import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor ingresa un correo electrónico válido']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  rol: {
    type: String,
    enum: ['administrador', 'gerente', 'empleado'],
    default: 'empleado',
    required: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

// Hash de la contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  // Solo proceder si la contraseña fue modificada
  if (!this.isModified('password')) return next();
  
  try {
    // Verificar si la contraseña ya está hasheada
    if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
      return next();
    }
    
    // Validar longitud mínima de la contraseña
    if (this.password.length < 6) {
      const error = new Error('La contraseña debe tener al menos 6 caracteres');
      return next(error);
    }
    
    // Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
