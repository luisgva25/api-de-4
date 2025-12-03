import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      await Swal.fire({
        icon: 'warning',
        title: 'Error de validación',
        text: 'Las contraseñas no coinciden',
        confirmButtonColor: '#0d6efd',
      });
      return;
    }

    if (password.length < 6) {
      await Swal.fire({
        icon: 'warning',
        title: 'Error de validación',
        text: 'La contraseña debe tener al menos 6 caracteres',
        confirmButtonColor: '#0d6efd',
      });
      return;
    }

    try {
      setError('');
      setLoading(true);
      const result = await register(name, email, password);
      
      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta ha sido creada correctamente. Por favor inicia sesión.',
          confirmButtonColor: '#198754',
        }).then(() => {
          navigate('/login');
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.error || 'Error al registrar el usuario',
          confirmButtonColor: '#dc3545',
        });
      }
    } catch (err) {
      console.error('Error en registro:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al conectar con el servidor',
        confirmButtonColor: '#dc3545',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">Crear Cuenta</Card.Title>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu correo"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crea una contraseña"
                    required
                  />
                  <Form.Text className="text-muted">
                    La contraseña debe tener al menos 6 caracteres.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu contraseña"
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : 'Registrarse'}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-3">
                <p className="mb-0">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login">Inicia sesión aquí</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
