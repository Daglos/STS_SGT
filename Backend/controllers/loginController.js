const { db, auth } = require('../config/firebase')

//desde frontend seria algo parecido a: signInWithEmailAndPassword(auth, correo, password)
/*desde aqui no se inicia sesión, solo obtiene info del usuario que React ya inició sesión usando Firebase Auth.

desde elfrontend se manda el uid, aqui se devuelve la info del usuario y el rol


para loggin desde React ejemplo
const userCredential = await signInWithEmailAndPassword(auth, correo, contrasena)
const uid = userCredential.user.uid

obtener info desde el backend
const res = await axios.post("http://localhost:3000/loggin/loggin", { uid })
*/

const iniciarSesion = async (req, res) => {
    try {
        const { uid } = req.body || {}

        if (!uid) {
            return res.status(400).json({
                success: false,
                error: "Falta el uid"
            })
        }

        // Buscar el usuario
        const usuarioDoc = await db.collection('usuarios').doc(uid).get()

        if (!usuarioDoc.exists) {
            return res.status(404).json({
                success: false,
                error: "Usuario no encontrado"
            })
        }

        const usuarioData = usuarioDoc.data()

        // obtener el rol
        const rolDoc = await db.collection('roles').doc(usuarioData.idRol).get()
        const rolNombre = rolDoc.exists ? rolDoc.data().rol : null

        return res.status(200).json({
            success: true,
            usuario: {
                uid: usuarioData.uid,
                nombre: usuarioData.nombre,
                apellido: usuarioData.apellido,
                correo: usuarioData.correo,
                estado: usuarioData.estado,
                idRol: usuarioData.idRol,
                rolNombre // este puede no ir, aqui va Empleado/Jefe
            }
        })


    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(401).json({
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