import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Spinner, Alert, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
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
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User> & { password?: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.rol !== 'administrador') {
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
      const usuarios = Array.isArray(data) ? data : data?.data ?? [];
      setUsers(usuarios);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      if (err instanceof Error && err.message === 'No autorizado') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (usuario: User) => {
    setEditingUserId(usuario._id);
    setEditForm({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      password: ''
    });
  };

  const handleChangeEditField = (field: keyof (User & { password: string }), value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (usuarioBase: User) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const nombre = (editForm.nombre ?? usuarioBase.nombre).trim();
      const email = (editForm.email ?? usuarioBase.email).trim();
      const rol = editForm.rol ?? usuarioBase.rol;
      const password = (editForm as any).password as string | undefined;

      // Validación de campos vacíos
      if (!nombre || !email || !rol) {
        setError('Ningún campo puede quedar vacío (nombre, email y rol son obligatorios)');
        return;
      }

      // Validación longitud mínima del nombre
      if (nombre.length < 3) {
        setError('El nombre debe tener al menos 3 caracteres');
        return;
      }

      // Regex aproximada para detectar emojis comunes
      const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u2600-\u26FF\u2700-\u27BF]/u;

      if (emojiRegex.test(nombre) || emojiRegex.test(email) || (password && emojiRegex.test(password))) {
        setError('Los campos no pueden contener emojis');
        return;
      }

      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('El correo electrónico no es válido');
        return;
      }

      // Validación de contraseña (solo si se proporciona una nueva)
      if (password && password.length > 0 && password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      const body: any = { nombre, email, rol };
      if (password && password.length >= 6) {
        body.password = password;
      }

      const response = await fetch(`${API_BASE}/api/usuarios/${usuarioBase._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Error al actualizar el usuario');
      }

      const updated = await response.json();
      const usuarioActualizado = updated.data ?? updated;

      setUsers(prev => prev.map(u => (u._id === usuarioBase._id ? usuarioActualizado : u)));
      setError('');
      setEditingUserId(null);
      setEditForm({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el usuario');
    }
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

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(6px)',
        zIndex: 1050
      }}
    >
      <Container style={{ maxWidth: '80vw' }}>
        <div
          className="rounded shadow p-4"
          style={{
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: '#1f1f1f',
            color: '#ffffff'
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0 text-white">Administración de Usuarios</h2>
            <Button
              size="sm"
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: '#dc3545',
                color: '#ffffff',
                borderColor: '#000000'
              }}
            >
              Cerrar
            </Button>
          </div>

          {loading && (
            <div className="d-flex justify-content-center align-items-center my-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          )}

          {error && (
            <Alert variant="danger" className="mb-3">{error}</Alert>
          )}

          {!loading && !error && (
            <Table
              bordered
              hover
              responsive
              size="sm"
              className="mb-0"
              style={{ color: '#ffffff', tableLayout: 'fixed' }}
            >
              <thead>
                <tr>
                  <th style={{ backgroundColor: 'aqua', color: '#000000' }}>ID</th>
                  <th style={{ backgroundColor: 'aqua', color: '#000000' }}>Nombre</th>
                  <th style={{ backgroundColor: 'aqua', color: '#000000' }}>Email</th>
                  <th style={{ backgroundColor: 'aqua', color: '#000000' }}>Password</th>
                  <th style={{ backgroundColor: 'aqua', color: '#000000' }}>Rol</th>
                  <th style={{ backgroundColor: 'aqua', color: '#000000' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isEditing = editingUserId === u._id;
                  return (
                    <tr key={u._id}>
                      <td
                        style={{
                          maxWidth: 200,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          color: '#ffffff'
                        }}
                      >
                        {isEditing ? (
                          <Form.Control
                            type="text"
                            value={editForm._id ?? u._id}
                            disabled
                            size="sm"
                            className="admin-edit-input"
                            style={{ backgroundColor: '#1f1f1f', color: '#ffffff', borderColor: '#555555' }}
                          />
                        ) : (
                          u._id
                        )}
                      </td>
                      <td
                        style={{
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          color: '#ffffff'
                        }}
                      >
                        {isEditing ? (
                          <Form.Control
                            type="text"
                            value={editForm.nombre ?? u.nombre}
                            onChange={(e) => handleChangeEditField('nombre', e.target.value)}
                            size="sm"
                            className="admin-edit-input"
                            style={{ backgroundColor: '#1f1f1f', color: '#ffffff', borderColor: '#555555' }}
                          />
                        ) : (
                          u.nombre
                        )}
                      </td>
                      <td
                        style={{
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          color: '#ffffff'
                        }}
                      >
                        {isEditing ? (
                          <Form.Control
                            type="email"
                            value={editForm.email ?? u.email}
                            onChange={(e) => handleChangeEditField('email', e.target.value)}
                            size="sm"
                            className="admin-edit-input"
                            style={{ backgroundColor: '#1f1f1f', color: '#ffffff', borderColor: '#555555' }}
                          />
                        ) : (
                          u.email
                        )}
                      </td>
                      <td
                        style={{
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          color: '#ffffff'
                        }}
                      >
                        {isEditing ? (
                          <Form.Control
                            type="password"
                            placeholder="Nueva contraseña (opcional)"
                            value={(editForm as any).password ?? ''}
                            onChange={(e) => handleChangeEditField('password', e.target.value)}
                            size="sm"
                            className="admin-edit-input"
                            style={{ backgroundColor: '#1f1f1f', color: '#ffffff', borderColor: '#555555' }}
                          />
                        ) : (
                          '********'
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <Form.Select
                            size="sm"
                            value={editForm.rol ?? u.rol}
                            onChange={(e) => handleChangeEditField('rol', e.target.value)}
                            className="admin-edit-input"
                            style={{ backgroundColor: '#1f1f1f', color: '#ffffff', borderColor: '#555555' }}
                          >
                            <option value="usuario">Usuario</option>
                            <option value="gerente">Gerente</option>
                            <option value="administrador">Administrador</option>
                          </Form.Select>
                        ) : (
                          <span className={`badge bg-${u.rol === 'administrador' ? 'danger' : u.rol === 'gerente' ? 'warning text-dark' : 'secondary'}`}>
                            {u.rol === 'administrador' ? 'Administrador' : u.rol === 'gerente' ? 'Gerente' : 'Usuario'}
                          </span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              className="me-2"
                              onClick={() => handleSaveEdit(u)}
                            >
                              Guardar
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={handleCancelEdit}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleStartEdit(u)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(u._id)}
                              disabled={u.rol === 'administrador'}
                            >
                              <FaTrash />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      </Container>
    </div>
  );
}
