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

const crearUser = async (req, res) => {
 try {
        const { correo, contrasena, nombre, apellido, idRol } = req.body
        
        /*  Validación básica
        if (!nombre || apellido === undefined || !contrasena || !correo || idRol) {
            return res.status(400).json({ 
                success: false, 
                error: 'Faltan campos requeridos' 
            })
        }*/
        
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


module.exports = {
    obtenerUser,
    crearUser
}