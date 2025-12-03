import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger-output.json';
// Importante: solo escanear server.js para evitar rutas duplicadas '/' y '/:id'
const endpointsFiles = ['./server.js'];

// Definir la documentación Swagger/OpenAPI
const doc = {
  info: {
    version: '1.0.0',
    title: 'API de Productos',
    description: 'Documentación de la API para gestión de productos',
    contact: {
      name: 'Soporte Técnico',
      email: 'soporte@api-productos.com'
    }
  },
  host: 'localhost:5000',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json', 'multipart/form-data'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Productos',
      description: 'Operaciones relacionadas con productos'
    }
  ],
  definitions: {
    Producto: {
      type: 'object',
      required: ['nombre', 'precio', 'stock', 'descripcion', 'fechaCaducidad', 'fechaCompra', 'proveedor', 'precioProducto'],
      properties: {
        _id: { type: 'string', example: '5f8d0f3d5d8a7c3e4c9d3e5f' },
        nombre: { type: 'string', description: 'Nombre del producto', example: 'Laptop HP', default: '' },
        precio: { type: 'number', format: 'float', description: 'Precio de venta del producto', example: 12500.99, default: 0 },
        descripcion: { type: 'string', description: 'Descripción detallada del producto', example: 'Laptop HP con procesador i7 y 16GB de RAM', default: '' },
        fechaCaducidad: { type: 'string', format: 'date-time', description: 'Fecha de caducidad (ISO8601)', example: '2025-12-31T00:00:00.000Z', default: '' },
        fechaCompra: { type: 'string', format: 'date-time', description: 'Fecha de compra (ISO8601)', example: '2025-01-15T00:00:00.000Z', default: '' },
        stock: { type: 'integer', description: 'Cantidad en inventario', example: 50, default: 0 },
        proveedor: { type: 'string', description: 'Nombre del proveedor', example: 'TecnoProveedores SA de CV', default: '' },
        precioProducto: { type: 'number', format: 'float', description: 'Precio de costo', example: 9500.50, default: 0 },
        imagenUrl: { type: 'string', description: 'URL pública de la imagen', example: 'http://localhost:5000/uploads/imagen.jpg' },
        __v: { type: 'number', example: 0 }
      },
      example: {
        _id: '5f8d0f3d5d8a7c3e4c9d3e5f',
        nombre: 'Laptop HP',
        precio: 12500.99,
        descripcion: 'Laptop HP con procesador i7 y 16GB de RAM',
        fechaCaducidad: '2025-12-31T00:00:00.000Z',
        fechaCompra: '2025-01-15T00:00:00.000Z',
        stock: 50,
        proveedor: 'TecnoProveedores SA de CV',
        precioProducto: 9500.50,
        imagenUrl: 'http://localhost:5000/uploads/imagen.jpg',
        __v: 0
      }
    },
    Error: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Mensaje de error', example: 'Error al procesar la solicitud' }
      }
    }
  },
  paths: {
    '/api/productos': {
      get: {
        tags: ['Productos'],
        summary: 'Obtener todos los productos',
        description: 'Retorna una lista de todos los productos disponibles',
        responses: {
          200: {
            description: 'Lista de productos obtenida exitosamente',
            schema: { type: 'array', items: { $ref: '#/definitions/Producto' } }
          },
          500: { description: 'Error del servidor', schema: { $ref: '#/definitions/Error' } }
        }
      },
      post: {
        tags: ['Productos'],
        summary: 'Crear un nuevo producto',
        description: 'Añade un nuevo producto al inventario. Enviar multipart/form-data (campo de archivo: imagen).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre', 'precio', 'descripcion', 'fechaCaducidad', 'fechaCompra', 'stock', 'proveedor', 'precioProducto'],
                properties: {
                  nombre: { type: 'string', example: 'Laptop HP' },
                  precio: { type: 'number', example: 12500.99 },
                  descripcion: { type: 'string', example: 'Laptop con procesador i7 y 16GB RAM' },
                  fechaCaducidad: { type: 'string', example: '2025-12-31T00:00:00.000Z', description: 'ISO8601' },
                  fechaCompra: { type: 'string', example: '2025-01-15T00:00:00.000Z', description: 'ISO8601' },
                  stock: { type: 'integer', example: 50 },
                  proveedor: { type: 'string', example: 'TecnoProveedores SA de CV' },
                  precioProducto: { type: 'number', example: 10000.50 }
                }
              }
            },
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['nombre', 'precio', 'descripcion', 'fechaCaducidad', 'fechaCompra', 'stock', 'proveedor', 'precioProducto'],
                properties: {
                  nombre: { type: 'string', example: 'Laptop HP' },
                  precio: { type: 'number', example: 12500.99 },
                  descripcion: { type: 'string', example: 'Laptop con procesador i7 y 16GB RAM' },
                  fechaCaducidad: { type: 'string', example: '2025-12-31T00:00:00.000Z', description: 'ISO8601' },
                  fechaCompra: { type: 'string', example: '2025-01-15T00:00:00.000Z', description: 'ISO8601' },
                  stock: { type: 'integer', example: 50 },
                  proveedor: { type: 'string', example: 'TecnoProveedores SA de CV' },
                  precioProducto: { type: 'number', example: 10000.50 },
                  imagen: { type: 'string', format: 'binary', description: 'Archivo JPG (opcional)' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Producto creado exitosamente', schema: { $ref: '#/definitions/Producto' } },
          400: { description: 'Datos inválidos', schema: { $ref: '#/definitions/Error' } },
          500: { description: 'Error del servidor', schema: { $ref: '#/definitions/Error' } }
        }
      }
    },
    '/api/productos/{id}': {
      get: {
        tags: ['Productos'],
        summary: 'Obtener un producto por ID',
        parameters: [ { name: 'id', in: 'path', required: true, type: 'string' } ],
        responses: {
          200: { description: 'Producto encontrado', schema: { $ref: '#/definitions/Producto' } },
          404: { description: 'Producto no encontrado', schema: { $ref: '#/definitions/Error' } },
          500: { description: 'Error del servidor', schema: { $ref: '#/definitions/Error' } }
        }
      },
      put: {
        tags: ['Productos'],
        summary: 'Actualizar un producto',
        description: 'Actualiza los datos del producto. Para reemplazar la imagen, enviar archivo JPG en el campo "imagen" (multipart/form-data).',
        parameters: [ { name: 'id', in: 'path', required: true, type: 'string' } ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string', example: 'Laptop HP Actualizada' },
                  precio: { type: 'number', example: 12999.99 },
                  descripcion: { type: 'string', example: 'Laptop actualizada' },
                  fechaCaducidad: { type: 'string', example: '2026-12-31T00:00:00.000Z', description: 'ISO8601' },
                  fechaCompra: { type: 'string', example: '2025-02-15T00:00:00.000Z', description: 'ISO8601' },
                  stock: { type: 'integer', example: 30 },
                  proveedor: { type: 'string', example: 'Nuevo Proveedor' },
                  precioProducto: { type: 'number', example: 10500.00 }
                }
              }
            },
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string', example: 'Laptop HP Actualizada' },
                  precio: { type: 'number', example: 12999.99 },
                  descripcion: { type: 'string', example: 'Laptop actualizada' },
                  fechaCaducidad: { type: 'string', example: '2026-12-31T00:00:00.000Z', description: 'ISO8601' },
                  fechaCompra: { type: 'string', example: '2025-02-15T00:00:00.000Z', description: 'ISO8601' },
                  stock: { type: 'integer', example: 30 },
                  proveedor: { type: 'string', example: 'Nuevo Proveedor' },
                  precioProducto: { type: 'number', example: 10500.00 },
                  imagen: { type: 'string', format: 'binary', description: 'Archivo JPG (opcional)' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Producto actualizado', schema: { $ref: '#/definitions/Producto' } },
          400: { description: 'Datos inválidos', schema: { $ref: '#/definitions/Error' } },
          404: { description: 'Producto no encontrado', schema: { $ref: '#/definitions/Error' } },
          500: { description: 'Error del servidor', schema: { $ref: '#/definitions/Error' } }
        }
      },
      delete: {
        tags: ['Productos'],
        summary: 'Eliminar un producto',
        parameters: [ { name: 'id', in: 'path', required: true, type: 'string' } ],
        responses: {
          200: { description: 'Producto eliminado exitosamente' },
          404: { description: 'Producto no encontrado', schema: { $ref: '#/definitions/Error' } },
          500: { description: 'Error del servidor', schema: { $ref: '#/definitions/Error' } }
        }
      }
    }
  }
};

// Configuración de Swagger Autogen
const options = {
  openapi: '3.0.0',
  language: 'es-ES',
  disableLogs: false,
  autoHeaders: false,
  autoQuery: false,
  autoBody: false
};

// Inicializar Swagger
swaggerAutogen(options)(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log('✅ Documentación Swagger generada correctamente');
    console.log('📄 Archivo: swagger-output.json');
    console.log('🌐 URL de documentación: http://localhost:5000/api-docs');
  })
  .catch(err => {
    console.error('❌ Error al generar la documentación:', err);
  });
