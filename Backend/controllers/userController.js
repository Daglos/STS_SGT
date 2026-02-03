const { db } = require('../config/firebase')
const nodemailer = require('nodemailer')
const crypto = require('crypto');


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
const bcrypt = require('bcrypt'); // Importar bcrypt

const crearUser = async (req, res) => {
    try {
        let { correo, contrasena, nombre, apellido, idRol } = req.body || {}; //let porque abajo se normaliza

        //  Validación básica
        if (!nombre || apellido === undefined || !contrasena || !correo || !idRol) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            });
        }

        // Normalizar el correo a minúsculas
        correo = correo.toLowerCase().trim();

        // Hashear la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // siempre el mismo rol de usuario
        idRol = idRol || "JN3KSuH83BfQrq314DHt";

        // Crear el objeto del usuario
        const newUser = {
            correo,
            contrasena: hashedPassword,
            nombre,
            apellido,
            idRol,
            estado: true
        };

        // Guardar en Firestore
        const docRef = await db.collection('usuarios').add(newUser);

        // Devolver el ID del usuario creado
        res.status(201).json({
            success: true,
            message: 'Usuario agregado exitosamente',
            data: {
                id: docRef.id,
                ...newUser
            }
        });

    } catch (error) {
        console.error('Error al agregar usuario:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
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
        if (idRol !== undefined) updatedData.idRol = idRol;

        // Verificar que haya un campo para actualizar
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No se enviaron datos para actualizar"
            });
        }

        if (contrasena) {
            await auth.updateUser(id, { password: contrasena });
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


// Solicitar código para cambiar la contraseña
const solicitarCambioContrasena = async (req, res) => {
    try {
        let { correo } = req.body || {};

        // let correo = 'richardgalo2003@gmail.com';

        if (!correo) return res.status(400).json({ success: false, error: 'Falta el correo' });

        correo = correo.toLowerCase().trim();

        // Buscar usuario por correo
        const userQuery = await db.collection('usuarios').where('correo', '==', correo).limit(1).get();
        if (userQuery.empty) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

        const userDoc = userQuery.docs[0];

        const codigo = crypto.randomBytes(3).toString('hex').toUpperCase(); // HEX

        const expiry = Date.now() + 15 * 60 * 1000; // 15 minutos

        await userDoc.ref.update({ resetCode: codigo, resetExpiry: expiry });

        // Configurar transporter con variables de entorno
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: `"Soporte" <${process.env.SMTP_USER}>`,
            to: correo,
            subject: 'Código de verificación para cambio de contraseña',
            text: `Hemos recibido una solicitud para cambiar tu contraseña.

            Tu código de verificación es: ${codigo}

            Este código es válido por 15 minutos.
            No compartas este código con nadie.
            
            Atentamente,
            Equipo de Soporte`,
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Cambio de contraseña</h2>
                <p>Hola,</p>

                <p>Hemos recibido una solicitud para cambiar tu contraseña.</p>

                <p style="font-size: 18px;">
                    <strong>Código de verificación:</strong>
                </p>

                <div style="
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 4px;
                    margin: 16px 0;
                ">
                    ${codigo}
                </div>

                <p>Este código es válido por <strong>15 minutos</strong>.</p>

                <p style="color: #b00020;">
                    <strong>No compartas este código con nadie.</strong>
                </p>

                <p>Si no solicitaste este cambio de contraseña, puedes ignorar este mensaje.</p>

                <hr />

                <p style="font-size: 12px; color: #777;">
                    Este correo fue enviado automáticamente. Por favor, no respondas a este mensaje.
                </p>
            </div>
            `
        };

        await transporter.verify().then(() => {
            console.log('Listo para enviar correos');
        });

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Código enviado al correo' });

    } catch (error) {
        console.error('Error en solicitarCambioContrasena:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Cambiar la contraseña usando el código enviado
const cambiarContrasena = async (req, res) => {
    try {
        let { correo, codigo, nuevaContrasena } = req.body || {};

        // let correo = 'richardgalo2003@gmail.com';
        // let codigo = 'E0161F';
        // let nuevaContrasena = 'richard';

        if (!correo || !codigo || !nuevaContrasena) {
            return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
        }

        correo = correo.toLowerCase().trim();

        const userQuery = await db.collection('usuarios').where('correo', '==', correo).limit(1).get();
        if (userQuery.empty) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

        const userDoc = userQuery.docs[0];
        const data = userDoc.data() || {};

        if (!data.resetCode || !data.resetExpiry) {
            return res.status(400).json({ success: false, error: 'No hay un código solicitado' });
        }

        if (data.resetCode !== codigo) {
            return res.status(400).json({ success: false, error: 'Código inválido' });
        }

        if (Date.now() > data.resetExpiry) {
            return res.status(400).json({ success: false, error: 'Código expirado' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(nuevaContrasena, saltRounds);

        await userDoc.ref.update({ contrasena: hashedPassword, resetCode: null, resetExpiry: null });

        res.json({ success: true, message: 'Contraseña actualizada correctamente' });

    } catch (error) {
        console.error('Error en cambiarContrasena:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Añadir las nuevas funciones a las exportaciones

module.exports = {
    obtenerUser,
    crearUser,
    actualizarUser,
    actualizarState,
    solicitarCambioContrasena,
    cambiarContrasena
}
