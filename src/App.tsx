import { useState, useEffect } from 'react';
import './App.css';
import Swal from 'sweetalert2';

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
}

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  // Estado para el producto en edición (no se usa directamente, se pasa como parámetro)
  const [, setEditingProduct] = useState<Producto | null>(null);

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/productos');
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      setProductos(data);
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
          <input id="swal-nombre" class="swal2-input" placeholder="Nombre del producto" value="${isEditing ? productoToEdit.nombre : ''}" required />
          <input id="swal-precio" type="number" step="0.01" class="swal2-input" placeholder="Precio de venta" value="${isEditing ? productoToEdit.precio : ''}" required />
          <input id="swal-descripcion" class="swal2-input" placeholder="Descripción" value="${isEditing ? productoToEdit.descripcion : ''}" required />
          <input id="swal-fecha-cad" type="date" class="swal2-input" value="${isEditing ? productoToEdit.fechaCaducidad.split('T')[0] : ''}" required />
          <input id="swal-fecha-compra" type="date" class="swal2-input" value="${isEditing ? productoToEdit.fechaCompra.split('T')[0] : ''}" required />
          <input id="swal-stock" type="number" class="swal2-input" placeholder="Stock" value="${isEditing ? productoToEdit.stock : ''}" required />
          <input id="swal-proveedor" class="swal2-input" placeholder="Proveedor" value="${isEditing ? productoToEdit.proveedor : ''}" required />
          <input id="swal-precio-prod" type="number" step="0.01" class="swal2-input" placeholder="Precio de compra" value="${isEditing ? productoToEdit.precioProducto : ''}" required />
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
            precioProducto: Number(precioProducto)
          };
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      if (!isConfirmed || !value) return;

      setLoading(true);
      const url = isEditing 
        ? `http://localhost:5000/api/productos/${productoToEdit._id}`
        : 'http://localhost:5000/api/productos';
      
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
        const response = await fetch(`http://localhost:5000/api/productos/${id}`, {
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

  return (
    <div className="app-container">
      <div className="header">
        <h1>Gestión de Productos</h1>
        <button onClick={() => handleAddProduct()} className="btn btn-primary">
          Agregar Producto
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : (
        <div className="products-grid">
          {productos.map((producto) => (
            <div key={producto._id} className="product-card">
              <div className="card-header">
                <h3>{producto.nombre}</h3>
                <div className="proveedor">{producto.proveedor}</div>
              </div>
              <div className="card-body">
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Descripción:</span>
                    <span className="detail-value">{producto.descripcion}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Precio Venta:</span>
                    <span className="detail-value">${producto.precio.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Precio Compra:</span>
                    <span className="detail-value">${producto.precioProducto.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Fecha Compra:</span>
                    <span className="detail-value">{formatDate(producto.fechaCompra)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Vencimiento:</span>
                    <span className="detail-value">{formatDate(producto.fechaCaducidad)}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <div className={`stock-badge ${producto.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {producto.stock > 0 ? `En stock: ${producto.stock}` : 'Sin stock'}
                  </div>
                  <div className="card-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProduct(producto);
                      }}
                      className="btn btn-edit"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(producto._id);
                      }}
                      className="btn btn-delete"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
