const { db } = require('../config/firebase')

const obtenerUser = async (req, res) => {
    try {
        const userSnapshot = await db.collection('usuarios').get()
        console.log(userSnapshot)
        const user = []

        userSnapshot.forEach(doc => {
            user.push({
                id: doc.id,
                ...doc.data()
            })
        })

        res.json({
            success: true,
            data: user,
            total: user.length
        })
    }
    catch (error) {
        console.error('Error al obtener los usarios:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

// Aqui falta poner que al crear un usuario de manera prefeterminada sea idRol Empleado
const crearUser = async (req, res) => {
 try {
        const { correo, contrasena, nombre, apellido, idRol } = req.body || {};
        
        //  Validación básica
        if (!nombre || apellido === undefined || !contrasena || !correo || idRol) {
            return res.status(400).json({ 
                success: false, 
                error: 'Faltan campos requeridos' 
            })
        }
        
        const newUser = {
            correo,
            contrasena,
            nombre,
            apellido,
            idRol 
        }
        
        const docRef = await db.collection('usuarios').add(newUser)
        
        //  Devolver el ID del usuario creado
        res.status(201).json({ 
            success: true, 
            message: 'Usuario agregado exitosamente',
            data: {
                id: docRef.id,
                ...newUser
            }
        })
    }
    catch(error) {
        console.error('Error al agregar usuario:', error)  //  Log del error
        res.status(500).json({ 
            success: false, 
            error: error.message 
        })
    }
}

// Aqui falta probar a editar/actualizar desde frontend como pasar el id del documento/registro
const actualizarUser = async (req, res) => {
try {
        const { id } = req.params;
        const { correo, contrasena, nombre, apellido, idRol } = req.body || {};

        // Validar que se envió ID
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "falta el ID del usuario"
            });
        }

        // Construir objeto con los campos que fueron enviados
        const updatedData = {};

        if (correo !== undefined) updatedData.correo = correo;
        if (contrasena !== undefined) updatedData.contrasena = contrasena;
        if (nombre !== undefined) updatedData.nombre = nombre;
        if (apellido !== undefined) updatedData.apellido = apellido;
        if (idRol!== undefined) updatedData.idRol = idRol;

        // Verificar que haya un campo para actualizar
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No se enviaron datos para actualizar"
            });
        }

        const userRef = db.collection('usuarios').doc(id);
        await userRef.update(updatedData);

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: { id, ...updatedData }
        });

    } catch (error) { 
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

//Aqui falta cambiar estado




module.exports = {
    obtenerUser,
    crearUser,
    actualizarUser
}