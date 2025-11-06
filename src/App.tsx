import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Swal from 'sweetalert2'

function App() {
  const [count, setCount] = useState(0)

  const handleAddProduct = async () => {
    const { isConfirmed, value } = await Swal.fire({
      title: 'Nuevo producto',
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre del producto" />
        <input id="swal-precio" type="number" step="0.01" class="swal2-input" placeholder="Precio" />
        <input id="swal-descripcion" class="swal2-input" placeholder="Descripción" />
        <input id="swal-fecha-cad" type="date" class="swal2-input" placeholder="Fecha de caducidad" />
        <input id="swal-fecha-compra" type="date" class="swal2-input" placeholder="Fecha de compra" />
        <input id="swal-stock" type="number" class="swal2-input" placeholder="Stock" />
        <input id="swal-proveedor" class="swal2-input" placeholder="Proveedor" />
        <input id="swal-precio-prod" type="number" step="0.01" class="swal2-input" placeholder="Precio del producto" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement)?.value?.trim()
        const precio = (document.getElementById('swal-precio') as HTMLInputElement)?.value?.trim()
        const descripcion = (document.getElementById('swal-descripcion') as HTMLInputElement)?.value?.trim()
        const fechaCaducidad = (document.getElementById('swal-fecha-cad') as HTMLInputElement)?.value?.trim()
        const fechaCompra = (document.getElementById('swal-fecha-compra') as HTMLInputElement)?.value?.trim()
        const stock = (document.getElementById('swal-stock') as HTMLInputElement)?.value?.trim()
        const proveedor = (document.getElementById('swal-proveedor') as HTMLInputElement)?.value?.trim()
        const precioProducto = (document.getElementById('swal-precio-prod') as HTMLInputElement)?.value?.trim()

        if (!nombre || !precio || !descripcion || !fechaCaducidad || !fechaCompra || !stock || !proveedor || !precioProducto) {
          Swal.showValidationMessage('Completa todos los campos')
          return
        }
        return {
          nombre,
          precio: Number(precio),
          descripcion,
          fechaCaducidad,
          fechaCompra,
          stock: Number(stock),
          proveedor,
          precioProducto: Number(precioProducto),
        }
      },
    })

    if (!isConfirmed || !value) return

    try {
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      })
      if (!res.ok) throw new Error('Solicitud fallida')
      await Swal.fire('Éxito', 'Producto guardado correctamente', 'success')
    } catch (err) {
      await Swal.fire('Error', 'No se pudo guardar el producto', 'error')
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={handleAddProduct} style={{ marginLeft: 12 }}>
          Agregar producto
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
