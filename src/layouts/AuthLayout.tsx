import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const AuthLayout = () => {
  return (
    <div className="min-vh-100 d-flex flex-column position-relative">
      {/* Video de fondo para páginas de autenticación */}
      <div className="video-background">
        <video
          id="auth-bg-video"
          autoPlay
          loop
          muted
          playsInline
          src="/wall2.mp4"
        >
          Tu navegador no soporta la reproducción de video.
        </video>
        <div className="video-overlay" />
      </div>

      <main className="flex-grow-1 d-flex align-items-center position-relative" style={{ zIndex: 1 }}>
        <Container>
          <Outlet />
        </Container>
      </main>
      <footer className="py-3 text-center text-muted position-relative" style={{ zIndex: 1 }}>
        <div className="container">
          <p className="mb-0">
            © {new Date().getFullYear()} ZarckDev. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
