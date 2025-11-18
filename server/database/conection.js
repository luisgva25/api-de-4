//1- importar mongoose
import mongoose from 'mongoose';
//2- crear funcion para conectarme a la base de datos
const conection = async () => {
    console.log("desde la funcion conection, intentando conectar");
    try {
        await mongoose.connect("mongodb://127.0.0.1:3000/api4",)
        console.log(':::EXITO conectado a la BD:::');
    } catch (error) {
        console.log('error', error);
        throw new Error(':::ERROR No se a podido estableser la conexion con la bd:::');
    };
}
//3- exportar la funcion
export default conection;
//4- para utilizarlo en otro archivo