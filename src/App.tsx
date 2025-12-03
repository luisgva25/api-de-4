<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
=======
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0
import { AuthProvider, useAuth } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

// Componentes de autenticación
import Login from './components/auth/Login';
import Register from './components/auth/Register';
<<<<<<< HEAD
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';

// Componentes de la aplicación
import Dashboard from './App.backup';
import AdminUsers from './pages/AdminUsers';
=======
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';

// Componente principal de la aplicación
import Dashboard from './App.backup';
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0

// Componente de navegación
const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

<<<<<<< HEAD
  // Depuración: Mostrar información del usuario en consola
  useEffect(() => {
    console.log('=== DEPURACIÓN ===');
    console.log('Usuario:', user);
    console.log('Autenticado:', isAuthenticated);
    console.log('Rol del usuario:', user?.rol);
    console.log('¿Es administrador?:', user?.rol === 'administrador');
    console.log('==================');
  }, [user, isAuthenticated]);

=======
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0
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
<<<<<<< HEAD
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/usuarios">
                  <i className="bi bi-people me-1"></i> Usuarios
                </Link>
              </li>
            )}
            {!isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Iniciar sesión</Link>
              </li>
=======
              <a className="nav-link" href="/">Inicio</a>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/dashboard">Dashboard</a>
                </li>
                {(user?.rol === 'admin' || user?.rol === 'gerente') && (
                  <li className="nav-item">
                    <a className="nav-link" href="/admin/usuarios">
                      <i className="bi bi-people-fill me-1"></i>
                      Tabla de Personal
                    </a>
                  </li>
                )}
              </>
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0
            )}
          </ul>
          {isAuthenticated ? (
            <div className="d-flex align-items-center">
              <span className="text-white me-3">
<<<<<<< HEAD
                Hola, {user?.nombre || 'Usuario'} 
                <span className="badge bg-light text-dark ms-2">
                  {user?.rol === 'administrador' ? 'Administrador' : 'Usuario'}
                </span>
              </span>
              <div className="d-flex">
                <button 
                  className="btn btn-outline-light" 
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
                </button>
                <button 
                  className="btn btn-outline-light" 
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
                </button>
                <button 
                  className="btn btn-outline-light" 
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> usuarios
                </button>
              </div>
=======
              Hola, {user?.nombre} 
              <span className="badge bg-light text-dark ms-2">
                {user?.rol === 'admin' ? 'Administrador' : user?.rol === 'gerente' ? 'Gerente' : 'Usuario'}
              </span>
            </span>
              <button 
                className="btn btn-outline-light" 
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
              </button>
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0
            </div>
          ) : (
            <div>
              <a href="/login" className="btn btn-outline-light me-2">Iniciar sesión</a>
              <a href="/register" className="btn btn-light">Registrarse</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Componente principal de la aplicación
const AppContent = () => {
<<<<<<< HEAD
  const { isAuthenticated } = useAuth();

=======
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0
  return (
    <div className="app">
      <Navigation />
      <main className="container py-4">
        <Routes>
<<<<<<< HEAD
          {/* Ruta raíz */}
          <Route path="/" element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <div className="text-center">
                <h1>Bienvenido a la Aplicación</h1>
                <p className="lead">Por favor inicia sesión o regístrate para continuar.</p>
                <div className="mt-4">
                  <Link to="/login" className="btn btn-primary btn-lg me-2">Iniciar sesión</Link>
                  <Link to="/register" className="btn btn-outline-primary btn-lg">Registrarse</Link>
                </div>
              </div>
            )
=======
          {/* Rutas públicas */}
          <Route path="/" element={
            <div className="text-center">
              <h1>Bienvenido a la Aplicación</h1>
              <p className="lead">Por favor inicia sesión o regístrate para continuar.</p>
              <div className="mt-4">
                <a href="/login" className="btn btn-primary btn-lg me-2">Iniciar sesión</a>
                <a href="/register" className="btn btn-outline-primary btn-lg">Registrarse</a>
              </div>
            </div>
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0
          } />
          
          {/* Rutas de autenticación */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
<<<<<<< HEAD
          {/* Ruta protegida para administradores */}
          <Route element={
            <ProtectedRoute 
              allowedRoles={['administrador']} 
            />
          }>
            <Route path="/admin/usuarios" element={<AdminUsers />} />
=======
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0
          </Route>
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <footer className="bg-light text-center text-lg-start mt-5">
        <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          © {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

// Componente raíz que envuelve todo con los providers necesarios
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
