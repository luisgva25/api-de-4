import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

// Componentes de autenticación
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';

// Componentes de la aplicación
import Dashboard from './App.backup';

// Componente de navegación
const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Depuración: Mostrar información del usuario en consola
  useEffect(() => {
    console.log('=== DEPURACIÓN ===');
    console.log('Usuario:', user);
    console.log('Autenticado:', isAuthenticated);
    console.log('Rol del usuario:', user?.rol);
    console.log('¿Es administrador?:', user?.rol === 'administrador');
    console.log('==================');
  }, [user, isAuthenticated]);

  // No mostrar la barra de navegación en las páginas de autenticación
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <a className="navbar-brand" href="/">Mi Aplicación</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            {isAuthenticated && user?.rol === 'administrador' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/usuarios">
                  <i className="bi bi-people me-1"></i> Usuarios
                </Link>
              </li>
            )}
          </ul>
          {isAuthenticated ? (
            <div className="d-flex align-items-center">
              <span className="text-white me-3">
                Hola, {user?.nombre || 'Usuario'}
                <span className="badge bg-light text-dark ms-2">
                  {user?.rol === 'administrador'
                    ? 'Administrador'
                    : user?.rol === 'gerente'
                      ? 'Gerente'
                      : 'Usuario'}
                </span>
              </span>
              {user?.rol === 'gerente' && (
                <Link
                  to="/"
                  className="btn btn-light me-2"
                >
                  <i className="bi bi-plus-circle me-1"></i> Agregar productos
                </Link>
              )}
              {user?.rol === 'administrador' && (
                <>
                  <Link
                    to="/"
                    className="btn btn-light me-2"
                  >
                    <i className="bi bi-plus-circle me-1"></i> Agregar productos
                  </Link>
                  <Link
                    to="/admin/usuarios"
                    className="btn btn-outline-light me-2"
                  >
                    <i className="bi bi-people me-1"></i> Administrar usuarios
                  </Link>
                </>
              )}
              <button
                className="btn btn-outline-light"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
              </button>
            </div>
          ) : (
            <div>
              <Link to="/login" className="btn btn-outline-light me-2">Iniciar sesión</Link>
              <Link to="/register" className="btn btn-light">Registrarse</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Componente principal de la aplicación
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />

      <main className="flex-grow-1">
        <Routes>
          {/* Ruta pública para el dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Rutas de autenticación */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Ruta protegida para administradores: misma página con panel flotante */}
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-light text-center text-lg-start mt-5">
        <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          © {new Date().getFullYear()} ZarckDev. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

// Componente principal con AuthProvider
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
