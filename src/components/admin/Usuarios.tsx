import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
  fechaRegistro: string;
  password?: string; // Add password as optional field
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Partial<Usuario> | null>(null);
  const { token } = useAuth();

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los usuarios');
      }
      
      const data = await response.json();
      setUsuarios(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUsuario) return;

    try {
      const url = currentUsuario._id 
        ? `http://localhost:5000/api/usuarios/${currentUsuario._id}`
        : 'http://localhost:5000/api/usuarios/registro';
      
      const method = currentUsuario._id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentUsuario)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el usuario');
      }

      setShowModal(false);
      setCurrentUsuario(null);
      await fetchUsuarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el usuario');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      await fetchUsuarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el usuario');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!currentUsuario) return;
    
    const { name, value } = e.target;
    setCurrentUsuario({
      ...currentUsuario,
      [name]: value
    });
  };

  const openEditModal = (usuario: Usuario) => {
    setCurrentUsuario({ ...usuario });
    setShowModal(true);
  };

  const openNewModal = () => {
    setCurrentUsuario({ nombre: '', email: '', rol: 'usuario', password: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentUsuario(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>
        <Button variant="primary" onClick={openNewModal}>
          <FaPlus className="me-2" /> Nuevo Usuario
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

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
          {usuarios.map((usuario) => (
            <tr key={usuario._id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>
                <span className={`badge ${
                  usuario.rol === 'admin' ? 'bg-danger' : 
                  usuario.rol === 'gerente' ? 'bg-warning text-dark' : 'bg-secondary'
                }`}>
                  {usuario.rol === 'admin' ? 'Administrador' : 
                   usuario.rol === 'gerente' ? 'Gerente' : 'Usuario'}
                </span>
              </td>
              <td>{new Date(usuario.fechaRegistro).toLocaleDateString()}</td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => openEditModal(usuario)}
                >
                  <FaEdit />
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDelete(usuario._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentUsuario?._id ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={currentUsuario?.nombre || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentUsuario?.email || ''}
                onChange={handleChange}
                required
                disabled={!!currentUsuario?._id}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="rol"
                value={currentUsuario?.rol || 'usuario'}
                onChange={handleChange}
                required
              >
                <option value="usuario">Usuario</option>
                <option value="gerente">Gerente</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>

            {!currentUsuario?._id && (
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={currentUsuario?.password || ''}
                  onChange={handleChange}
                  required={!currentUsuario?._id}
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              <FaTimes className="me-2" /> Cancelar
            </Button>
            <Button variant="primary" type="submit">
              <FaSave className="me-2" /> Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Usuarios;
