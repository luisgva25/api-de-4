import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../contexts/AuthContext';

interface User {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
  fechaRegistro: string;
}

const API_BASE = 'http://localhost:5000';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.rol !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${API_BASE}/api/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado');
        }
        throw new Error('Error al cargar usuarios');
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      if (err instanceof Error && err.message === 'No autorizado') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId: string) => {
    navigate(`/admin/usuarios/editar/${userId}`);
  };

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/usuarios/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al eliminar usuario');

        setUsers(users.filter(u => u._id !== userId));
        Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Administración de Usuarios</h2>
        <Button variant="primary" onClick={() => navigate('/admin/usuarios/nuevo')}>
          <FaUserPlus className="me-2" /> Nuevo Usuario
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Fecha de Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.nombre}</td>
              <td>{user.email}</td>
              <td>
                <span className={`badge bg-${user.rol === 'admin' ? 'danger' : 'primary'}`}>
                  {user.rol}
                </span>
              </td>
              <td>{formatDate(user.fechaRegistro)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(user._id)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(user._id)}
                  disabled={user.rol === 'admin'}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
