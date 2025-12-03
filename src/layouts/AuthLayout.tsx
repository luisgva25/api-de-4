import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const AuthLayout = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="flex-grow-1 d-flex align-items-center">
        <Container>
          <Outlet />
        </Container>
      </main>
      <footer className="py-3 text-center text-muted">
        <div className="container">
          <p className="mb-0">© {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
