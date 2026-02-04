const { db } = require('../config/firebase');
const bcrypt = require('bcrypt');

const iniciarSesion = async (req, res) => {
    try {
        let { correo, contrasena } = req.body || {};

        // validaciones basicas
        if (!correo || !contrasena) {
            return res.status(400).json({
                success: false,
                error: "Correo y contraseña son requeridos"
            });
        }

        correo = correo.toLowerCase().trim();

        // buscar el usuario con el correo
        const snapshot = await db.collection('usuarios').where('correo', '==', correo).limit(1).get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                error: "Credenciales incorrectas"
            });
        }

        const doc = snapshot.docs[0];
        const usuarioData = doc.data();

        // validar contraseña
        const contrasenaMatch = await bcrypt.compare(contrasena, usuarioData.contrasena);
        if (!contrasenaMatch) {
            return res.status(401).json({
                success: false,
                error: "Credenciales incorrectas"
            });
        }

        // obtener rol
        let rolNombre = null;
        const rolDoc = await db.collection('roles').doc(usuarioData.idRol).get();

        if (rolDoc.exists) {
            rolNombre = rolDoc.data().rol;
        }

        return res.status(200).json({
            success: true,
            usuario: {
                id: doc.id,
                nombre: usuarioData.nombre,
                apellido: usuarioData.apellido,
                correo: usuarioData.correo,
                estado: usuarioData.estado,
                idRol: usuarioData.idRol,
                rolNombre
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }

}

// const crearPrueba = async (req, res) => {
//     try {
//         // Datos de prueba
//         let correo = "empleado@test.com";
//         let contrasena = "123456";
//         let nombre = "Juan";
//         let apellido = "Pérez";
//         let idRol = "JN3KSuH83BfQrq314DHt"; // Empleado

//         correo = correo.toLowerCase().trim();

//         const userCredential = await auth.createUserWithEmailAndPassword(correo, contrasena);
//         const uid = userCredential.user.uid;

//         const newUser = { correo, nombre, apellido, idRol, uid };
//         const docRef = await db.collection('usuarios').add(newUser);

//         res.status(201).json({
//             success: true,
//             message: 'Usuario creado exitosamente (TEST)',
//             data: { id: docRef.id, ...newUser }
//         });

//     } catch (error) {
//         console.error('Error al crear usuario TEST:', error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// }


// const iniciarPrueba = async (req, res) => {
//     try {
//         // Datos de prueba
//         let correo = "empleado@test.com";
//         let contrasena = "123456";

//         const correoNormalizado = correo.toLowerCase().trim();

//         const userCredential = await auth.signInWithEmailAndPassword(correoNormalizado, contrasena);
//         const user = userCredential.user;

//         const snapshot = await db.collection('usuarios')
//             .where('uid', '==', user.uid)
//             .limit(1)
//             .get();

//         if (snapshot.empty) {
//             return res.status(404).json({ success: false, error: 'No encontrado en Firestore' });
//         }

//         const usuarioData = snapshot.docs[0].data();

//         return res.status(200).json({
//             success: true,
//             usuario: {
//                 uid: usuarioData.uid,
//                 nombre: usuarioData.nombre,
//                 apellido: usuarioData.apellido,
//                 correo: usuarioData.correo,
//                 idRol: usuarioData.idRol
//             }
//         });

//     } catch (error) {
//         console.error('Error login TEST:', error);
//         res.status(401).json({ success: false, error: 'Credenciales inválidas' });
//     }
// }

module.exports = {
    iniciarSesion
}