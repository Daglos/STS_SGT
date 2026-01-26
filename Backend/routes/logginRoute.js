/* Aqui hacer "función" que reciba correo y contraseña desde el frontend y verificar que esos datos existen en la base
y devolver true o el json con la informacion del usuario.

Importante devolver el rol que tiene ese usuario idRol para verificar si es Empleado o Jefe

*/

const { db } = require('../config/firebase')

const iniciarSesion = async () => {

    const { correo, contrasena } = req.body || {}
    //buscar esos datos que existan


    //deshashear la contraseña

    let sesionIniciada = false
    if (sesionIniciada) {

        //Buscar con los datos deshasheados el registro usando el id


        //Obtener el rol del usuario usando el id
        res.status(200).json({
            success: true,
            rol: "Empleado o Jefe"
        })
    } else {
        res.status(200).json({
            success: false
        })
    }
}