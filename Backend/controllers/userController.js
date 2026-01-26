const { db, auth, admin } = require('../config/firebase')

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


//desde frontend seria algo parecido a: createUserWithEmailAndPassword(auth, correo, password)


const crearUser = async (req, res) => {
    try {
        const { correo, contrasena, nombre, apellido, estado } = req.body || {};

        //  Validación básica
        if (!nombre || !apellido || !contrasena || !correo || !estado) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            })
        }

        const correoNormalizado = correo.toLowerCase().trim()

        const userCredential = await admin.auth().createUser({
            email: correoNormalizado,
            password: contrasena
        })

        const uid = userCredential.uid;

        const newUser = {
            correo: correoNormalizado,
            nombre,
            apellido,
            estado,
            idRol: "JN3KSuH83BfQrq314DHt",
            uid
        }

        const docRef = await db.collection('usuarios').doc(uid).set(newUser)

        //  Devolver el ID del usuario creado
        res.status(201).json({
            success: true,
            message: 'Usuario agregado exitosamente',
            data: newUser
        })
    }
    catch (error) {
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
        const { correo, contrasena, nombre, apellido, estado, idRol } = req.body || {};

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
        if (estado !== undefined) updatedData.estado = estado;
        if (idRol !== undefined) updatedData.idRol = idRol;

        // Verificar que haya un campo para actualizar
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No se enviaron datos para actualizar"
            });
        }

        if (contrasena) {
            await admin.auth().updateUser(id, { password: contrasena });
        }

        if (Object.keys(updatedData).length > 0) {
            const userRef = db.collection('usuarios').doc(id);
            await userRef.update(updatedData);
        }

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

const actualizarState = async (req, res) => {
try {
        const { id } = req.params;
        const { estado } = req.body || {};

        // Validar que se envió ID
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "falta el ID del usuario"
            });
        }

        // Construir objeto con los campos que fueron enviados
        const updatedData = {};

        if (estado !== undefined) updatedData.estado = estado;

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
    actualizarUser,
    actualizarState
}