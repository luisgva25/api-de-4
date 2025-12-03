import Producto from "../models/Producto.model.js";

const producto = async (req, res) => {
    try {
        const { nombre, precio, descripcion, fechaCaducidad, fechaCompra, stock, proveedor, precioProducto } = req.body;

        const precioNum = Number(precio);
        const stockNum = Number(stock);
        const precioProductoNum = Number(precioProducto);
        const fechaCad = new Date(fechaCaducidad);
        const fechaComp = new Date(fechaCompra);

        if (!nombre?.trim() || !descripcion?.trim() || !proveedor?.trim() ||
            Number.isNaN(precioNum) || Number.isNaN(stockNum) || Number.isNaN(precioProductoNum) ||
            isNaN(fechaCad.getTime()) || isNaN(fechaComp.getTime())) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos obligatorios o formato inválido"
            });
        }
        const imagenUrl = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            : undefined;

        const nuevoProducto = new Producto({
            nombre,
            precio: precioNum,
            descripcion,
            fechaCaducidad: fechaCad,
            fechaCompra: fechaComp,
            stock: stockNum,
            proveedor,
            precioProducto: precioProductoNum,
            imagenUrl
        })
        const productoGuardado = await nuevoProducto.save();
        return res.status(201).json({
            status: "success",
            message: "Producto guardado con exito",
            data: productoGuardado
        })
    } catch (error) {
        console.log("ERROR al guardar producto: ", error);
        return res.status(500).json({
            status: "error",
            message: "ERROR en el servidor",
            error: error.message
        })
    }
}

const productoPorID = async (req, res) => {
    try {
        const id = req.params.id;
        const productoEncontrado = await Producto.findById(id);
        if (!productoEncontrado) {
            return res.status(404).json({
                status: "error",
                message: "Producto no encontrado"
            });
        }
        return res.status(200).json({
            status: "success",
            data: productoEncontrado
        })
    } catch (error) {
        console.log("ERROR al obtener producto por ID: ", error);
        return res.status(500).json({
            status: "error",
            message: "ERROR en el servidor",
            error: error.message
        })
    }
}

const eliminarProducto = async (req, res) => {
    try {
        const id = req.params.id;
        const productoEliminado = await Producto.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({
                status: "error",
                message: "Producto no encontrado"
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Producto eliminado con exito",
            data: productoEliminado
        })
    } catch (error) {
        console.log("ERROR al eliminar producto: ", error);
        return res.status(500).json({
            status: "error",
            message: "ERROR en el servidor",
            error: error.message
        })
    }
}

const actualizarProducto = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, precio, descripcion, fechaCaducidad, fechaCompra, stock, proveedor, precioProducto } = req.body;

        const productoActualizado = {};
        if (typeof nombre !== 'undefined') productoActualizado.nombre = nombre;
        if (typeof precio !== 'undefined') {
            const precioNum = Number(precio);
            if (Number.isNaN(precioNum)) return res.status(400).json({ status: 'error', message: 'Precio inválido' });
            productoActualizado.precio = precioNum;
        }
        if (typeof descripcion !== 'undefined') productoActualizado.descripcion = descripcion;
        if (typeof fechaCaducidad !== 'undefined') {
            const fechaCad = new Date(fechaCaducidad);
            if (isNaN(fechaCad.getTime())) return res.status(400).json({ status: 'error', message: 'Fecha de caducidad inválida' });
            productoActualizado.fechaCaducidad = fechaCad;
        }
        if (typeof fechaCompra !== 'undefined') {
            const fechaComp = new Date(fechaCompra);
            if (isNaN(fechaComp.getTime())) return res.status(400).json({ status: 'error', message: 'Fecha de compra inválida' });
            productoActualizado.fechaCompra = fechaComp;
        }
        if (typeof stock !== 'undefined') {
            const stockNum = Number(stock);
            if (Number.isNaN(stockNum)) return res.status(400).json({ status: 'error', message: 'Stock inválido' });
            productoActualizado.stock = stockNum;
        }
        if (typeof proveedor !== 'undefined') productoActualizado.proveedor = proveedor;
        if (typeof precioProducto !== 'undefined') {
            const precioProductoNum = Number(precioProducto);
            if (Number.isNaN(precioProductoNum)) return res.status(400).json({ status: 'error', message: 'Precio de compra inválido' });
            productoActualizado.precioProducto = precioProductoNum;
        }
        if (req.file) {
            productoActualizado.imagenUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const producto = await Producto.findByIdAndUpdate(id, productoActualizado, {
            new: true,
            runValidators: true
        });
        if (!producto) {
            return res.status(404).json({
                status: "error",
                message: "Producto no encontrado"
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Producto actualizado con exito",
            data: producto
        })
    } catch (error) {
        console.log("ERROR al actualizar producto: ", error);
        return res.status(500).json({
            status: "error",
            message: "ERROR en el servidor",
            error: error.message
        })
    }
}

const obtenerTodosLosProductos = async (req, res) => {
    try {
<<<<<<< HEAD
        let query = {};
        let sort = {};
        
        // Si es un empleado, solo puede ver los productos ordenados por ID
        if (req.usuario.rol === 'empleado') {
            sort = { _id: 1 }; // Ordenar por ID ascendente
        }
        
        const productos = await Producto.find(query).sort(sort);
        
        return res.status(200).json({
            status: "success",
            message: "Productos obtenidos con éxito",
            data: productos,
            total: productos.length,
            // Incluir el rol del usuario en la respuesta para depuración
            userRole: req.usuario.rol
=======
        const productos = await Producto.find();
        return res.status(200).json({
            status: "success",
            message: "Productos obtenidos con exito",
            data: productos,
            total: productos.length
>>>>>>> f347c7b7250b0da4ff34669d167596663f4205f0
        })
    } catch (error) {
        console.log("ERROR al obtener productos: ", error);
        return res.status(500).json({
            status: "error",
            message: "ERROR en el servidor",
            error: error.message
        })
    }
}

export default {
    producto,
    productoPorID,
    eliminarProducto,
    actualizarProducto,
    obtenerTodosLosProductos
}
