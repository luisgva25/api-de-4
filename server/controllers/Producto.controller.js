import Producto from "../models/Producto.model.js";

const producto = async (req, res) => {
    try {
        const { nombre, precio, descripcion, fechaCaducidad, fechaCompra, stock, proveedor, precioProducto } = req.body;
        if (!nombre || !precio || !descripcion || !fechaCaducidad || !fechaCompra || !stock || !proveedor || !precioProducto) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos obligatorios"
            });
        }
        const nuevoProducto = new Producto({
            nombre,
            precio,
            descripcion,
            fechaCaducidad,
            fechaCompra,
            stock,
            proveedor,
            precioProducto
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
        if (!nombre || !precio || !descripcion || !fechaCaducidad || !fechaCompra || !stock || !proveedor || !precioProducto) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos obligatorios"
            });
        }
        const productoActualizado = {};
        if (nombre) productoActualizado.nombre = nombre;
        if (precio) productoActualizado.precio = precio;
        if (descripcion) productoActualizado.descripcion = descripcion;
        if (fechaCaducidad) productoActualizado.fechaCaducidad = fechaCaducidad;
        if (fechaCompra) productoActualizado.fechaCompra = fechaCompra;
        if (stock) productoActualizado.stock = stock;
        if (proveedor) productoActualizado.proveedor = proveedor;
        if (precioProducto) productoActualizado.precioProducto = precioProducto;

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
        const productos = await Producto.find();
        return res.status(200).json({
            status: "success",
            message: "Productos obtenidos con exito",
            data: productos,
            total: productos.length
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
