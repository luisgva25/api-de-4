import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Offcanvas,
  ListGroup,
  Spinner,
  Badge,
  Card,
  Form,
  Modal
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { FaPlus, FaTrash, FaEdit, FaBars } from 'react-icons/fa';

const API_BASE = 'http://localhost:5000';

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  fechaCaducidad: string;
  fechaCompra: string;
  stock: number;
  proveedor: string;
  precioProducto: number;
  imagenUrl?: string;
}

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Producto>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const formRef = useRef<HTMLFormElement>(null);

  // Efecto para manejar el video de fondo
  useEffect(() => {
    const video = document.getElementById('bg-video') as HTMLVideoElement;
    if (video) {
      video.play().catch(error => {
        console.log('Error al reproducir el video:', error);
      });
    }
  }, []);

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/productos`);
      if (!response.ok) throw new Error('Error al cargar productos');
      const result = await response.json();
      // El servidor devuelve { status, message, data, total }
      const data = Array.isArray(result) ? result : (result?.data ?? []);
      setProductos(data);
      if (Array.isArray(data) && data.length === 0) {
        await Swal.fire('Sin productos', 'Ningún producto hasta el momento', 'info');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productoToEdit: Producto | null = null) => {
    try {
      const isEditing = !!productoToEdit;
      const { isConfirmed, value } = await Swal.fire({
        title: isEditing ? 'Editar Producto' : 'Nuevo Producto',
        html: `
          <div class="form-group">
            <label for="swal-nombre">Nombre del producto</label>
            <input id="swal-nombre" class="swal2-input" placeholder="Ej: Laptop HP" value="${isEditing ? productoToEdit.nombre : ''}" required 
                   aria-label="Nombre del producto" />
          </div>
          <div class="form-group">
            <label for="swal-precio">Precio de venta</label>
            <input id="swal-precio" type="number" step="0.01" class="swal2-input" 
                   placeholder="0.00" value="${isEditing ? productoToEdit.precio : ''}" required 
                   aria-label="Precio de venta" />
          </div>
          <div class="form-group">
            <label for="swal-descripcion">Descripción</label>
            <textarea id="swal-descripcion" class="swal2-textarea" rows="2" 
                     placeholder="Descripción detallada del producto" 
                     aria-label="Descripción del producto">${isEditing ? productoToEdit.descripcion : ''}</textarea>
          </div>
          <div class="form-group">
            <label for="swal-imagen-url">URL de imagen (opcional)</label>
            <input id="swal-imagen-url" type="url" class="swal2-input" 
                   placeholder="https://..." value="${isEditing ? (productoToEdit.imagenUrl || '') : ''}" 
                   aria-label="URL de imagen" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="swal-fecha-cad">Fecha de caducidad</label>
              <input id="swal-fecha-cad" type="date" class="swal2-input" 
                     value="${isEditing ? productoToEdit.fechaCaducidad.split('T')[0] : ''}" required 
                     aria-label="Fecha de caducidad" />
            </div>
            <div class="form-group">
              <label for="swal-fecha-compra">Fecha de compra</label>
              <input id="swal-fecha-compra" type="date" class="swal2-input" 
                     value="${isEditing ? productoToEdit.fechaCompra.split('T')[0] : ''}" required 
                     aria-label="Fecha de compra" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="swal-stock">Stock</label>
              <input id="swal-stock" type="number" class="swal2-input" 
                     placeholder="0" value="${isEditing ? productoToEdit.stock : ''}" required 
                     aria-label="Cantidad en stock" min="0" />
            </div>
            <div class="form-group">
              <label for="swal-proveedor">Proveedor</label>
              <input id="swal-proveedor" class="swal2-input" 
                     placeholder="Nombre del proveedor" value="${isEditing ? productoToEdit.proveedor : ''}" required 
                     aria-label="Nombre del proveedor" />
            </div>
          </div>
          <div class="form-group">
            <label for="swal-precio-prod">Precio de compra</label>
            <input id="swal-precio-prod" type="number" step="0.01" class="swal2-input" 
                   placeholder="0.00" value="${isEditing ? productoToEdit.precioProducto : ''}" required 
                   aria-label="Precio de compra" />
          </div>
          <style>
            .form-group { margin-bottom: 1rem; }
            .form-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
            .form-row .form-group { flex: 1; }
            label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333; }
            .swal2-input, .swal2-textarea { 
              width: 100% !important; 
              margin: 0.25rem 0 !important;
              padding: 0.75rem !important;
              border: 1px solid #ddd !important;
              border-radius: 4px !important;
            }
            .swal2-textarea { resize: vertical; min-height: 80px; }
            @media (max-width: 768px) {
              .form-row { flex-direction: column; gap: 0.5rem; }
              .swal2-popup { width: 90% !important; }
            }
            @media (max-width: 480px) {
              .swal2-popup { width: 95% !important; padding: 1rem !important; }
              .swal2-input, .swal2-textarea { padding: 0.6rem !important; }
            }
          </style>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const nombre = (document.getElementById('swal-nombre') as HTMLInputElement)?.value?.trim();
          const precio = (document.getElementById('swal-precio') as HTMLInputElement)?.value?.trim();
          const descripcion = (document.getElementById('swal-descripcion') as HTMLInputElement)?.value?.trim();
          const fechaCaducidad = (document.getElementById('swal-fecha-cad') as HTMLInputElement)?.value?.trim();
          const fechaCompra = (document.getElementById('swal-fecha-compra') as HTMLInputElement)?.value?.trim();
          const stock = (document.getElementById('swal-stock') as HTMLInputElement)?.value?.trim();
          const proveedor = (document.getElementById('swal-proveedor') as HTMLInputElement)?.value?.trim();
          const precioProducto = (document.getElementById('swal-precio-prod') as HTMLInputElement)?.value?.trim();
          const imagenUrl = (document.getElementById('swal-imagen-url') as HTMLInputElement)?.value?.trim();

          if (!nombre || !precio || !descripcion || !fechaCaducidad || !fechaCompra || !stock || !proveedor || !precioProducto) {
            Swal.showValidationMessage('Completa todos los campos');
            return null;
          }

          return {
            nombre,
            precio: Number(precio),
            descripcion,
            fechaCaducidad: new Date(fechaCaducidad).toISOString(),
            fechaCompra: new Date(fechaCompra).toISOString(),
            stock: Number(stock),
            proveedor,
            precioProducto: Number(precioProducto),
            imagenUrl
          };
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      if (!isConfirmed || !value) return;

      setLoading(true);
      const url = isEditing
        ? `${API_BASE}/api/productos/${productoToEdit._id}`
        : `${API_BASE}/api/productos`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al guardar el producto');
      }

      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Producto guardado correctamente',
      });
      fetchProductos();
    } catch (error: unknown) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudo guardar el producto';
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleEditProduct = (producto: Producto) => {
    setEditingProduct(producto);
    handleAddProduct(producto);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const response = await fetch(`${API_BASE}/api/productos/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar el producto');

        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
        fetchProductos();
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' || name === 'precioProducto'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        Swal.fire('Archivo inválido', 'Solo se permiten imágenes JPG', 'warning');
        setImageFile(null);
        setImagePreview('');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = editingProduct
        ? `${API_BASE}/api/productos/${editingProduct._id}`
        : `${API_BASE}/api/productos`;

      const method = editingProduct ? 'PUT' : 'POST';

      const bodyForm = new FormData();
      bodyForm.append('nombre', formData.nombre || '');
      bodyForm.append('precio', String(formData.precio ?? ''));
      bodyForm.append('descripcion', formData.descripcion || '');
      bodyForm.append('fechaCompra', formData.fechaCompra ? new Date(formData.fechaCompra).toISOString() : '');
      bodyForm.append('fechaCaducidad', formData.fechaCaducidad ? new Date(formData.fechaCaducidad).toISOString() : '');
      bodyForm.append('stock', String(formData.stock ?? ''));
      bodyForm.append('proveedor', formData.proveedor || '');
      bodyForm.append('precioProducto', String(formData.precioProducto ?? ''));
      if (imageFile) bodyForm.append('imagen', imageFile);

      const response = await fetch(url, {
        method,
        body: bodyForm,
      });

      if (!response.ok) {
        let msg = 'Error al guardar el producto';
        try {
          const err = await response.json();
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      setShowModal(false);
      setFormData({});
      setImageFile(null);
      setImagePreview('');
      fetchProductos();

      Swal.fire(
        '¡Éxito!',
        `Producto ${editingProduct ? 'actualizado' : 'agregado'} correctamente.`,
        'success'
      );
    } catch (error) {
      console.error('Error:', error);
      const msg = error instanceof Error ? error.message : 'No se pudo guardar el producto';
      Swal.fire('Error', msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      fechaCaducidad: producto.fechaCaducidad.split('T')[0],
      fechaCompra: producto.fechaCompra.split('T')[0],
      stock: producto.stock,
      proveedor: producto.proveedor,
      precioProducto: producto.precioProducto,
      imagenUrl: producto.imagenUrl
    });
    setImageFile(null);
    setImagePreview(producto.imagenUrl || '');
    setShowModal(true);
  };

  // Función para eliminar un producto
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE}/api/productos/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error al eliminar el producto');

        fetchProductos();

        Swal.fire(
          '¡Eliminado!',
          'El producto ha sido eliminado.',
          'success'
        );
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
      }
    }
  };

  return (
    <div className="app-container">
      {/* Video de fondo */}
      <div className="video-background">
        <video
          id="bg-video"
          autoPlay
          loop
          muted
          playsInline
          src="/wall1.mp4"
          onError={(e) => console.error('Error al cargar el video:', e)}
        >
          Tu navegador no soporta la reproducción de video.
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Sidebar con Offcanvas de Bootstrap */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} className="sidebar">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Productos Registrados</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <Spinner animation="border" variant="light" />
              <p className="mt-3">Cargando productos...</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {productos.map((producto) => (
                <ListGroup.Item
                  key={producto._id}
                  className="bg-transparent text-white border-secondary"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{producto.nombre}</h6>
                      <small className="text-muted">
                        Stock: <Badge bg="secondary">{producto.stock}</Badge>
                      </small>
                    </div>
                    <div>
                      <Badge bg="success" className="me-1">
                        ${producto.precio.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Contenido principal */}
      <div className="content-wrapper">
        <header className="main-header">
          <div className="d-flex align-items-center">
            <Button
              variant="outline-light"
              className="me-3 d-md-none"
              onClick={() => setShowSidebar(true)}
            >
              <FaBars />
            </Button>
            <h1 className="mb-0">Gestión de Productos</h1>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingProduct(null);
              setFormData({});
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" />
            Agregar Producto
          </Button>
        </header>

        <Container fluid className="py-4">
          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <Spinner animation="border" variant="light" />
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
              {productos.map((producto) => (
                <Col key={producto._id}>
                  <div className="card h-100 bg-dark text-white" style={{ borderColor: '#444' }}>
                    {producto.imagenUrl ? (
                      <img
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        style={{ width: '100%', height: 180, objectFit: 'cover' }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : null}
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="mb-0">{producto.nombre}</h5>
                        <div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleEdit(producto)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(producto._id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                      <h6 className="mb-2 text-muted">
                        Proveedor: {producto.proveedor}
                      </h6>
                      <p className="mb-3">
                        {producto.descripcion}
                      </p>
                      <ListGroup variant="flush" className="mb-3">
                        <ListGroup.Item className="bg-transparent text-white border-secondary">
                          <div className="d-flex justify-content-between">
                            <span>Precio de venta:</span>
                            <span className="fw-bold">${producto.precio.toFixed(2)}</span>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="bg-transparent text-white border-secondary">
                          <div className="d-flex justify-content-between">
                            <span>Precio de compra:</span>
                            <span>${producto.precioProducto.toFixed(2)}</span>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="bg-transparent text-white border-secondary">
                          <div className="d-flex justify-content-between">
                            <span>Stock disponible:</span>
                            <Badge bg={producto.stock > 0 ? 'success' : 'danger'}>
                              {producto.stock} unidades
                            </Badge>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="bg-transparent text-white-50 border-secondary">
                          <small>
                            Comprado: {formatDate(producto.fechaCompra)}
                          </small>
                        </ListGroup.Item>
                        <ListGroup.Item className="bg-transparent text-white-50 border-secondary">
                          <small>
                            Vence: {formatDate(producto.fechaCaducidad)}
                          </small>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      {/* Modal para agregar/editar producto */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton closeVariant="white" className="bg-dark text-white">
          <Modal.Title>
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <Modal.Body className="bg-dark text-white">
            <Form.Group className="mb-3">
              <Form.Label>Nombre del producto</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio de venta</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="precio"
                    value={formData.precio || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio de compra</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="precioProducto"
                    value={formData.precioProducto || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Imagen (JPG)</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={handleFileChange}
              />
              <Form.Text className="text-muted">Solo archivos .jpg o .jpeg (máx. 5MB)</Form.Text>
            </Form.Group>
            {imagePreview || formData.imagenUrl ? (
              <div className="mb-3">
                <img
                  src={imagePreview || (formData.imagenUrl as string)}
                  alt="Vista previa"
                  style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 4 }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            ) : null}

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de compra</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaCompra"
                    value={formData.fechaCompra || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de caducidad</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaCaducidad"
                    value={formData.fechaCaducidad || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock || ''}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Proveedor</Form.Label>
                  <Form.Control
                    type="text"
                    name="proveedor"
                    value={formData.proveedor || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-dark border-secondary">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
