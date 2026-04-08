const { db } = require('../config/firebase')
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const validarContrasena = (contrasena) => {
    const minLen = 12;
    const hasUpper = /[A-Z]/.test(contrasena);
    const hasLower = /[a-z]/.test(contrasena);
    const hasDigit = /[0-9]/.test(contrasena);
    const hasSpecial = /[^A-Za-z0-9]/.test(contrasena);
    const noSpaces = !/\s/.test(contrasena);

    return contrasena &&
        contrasena.length >= minLen &&
        hasUpper &&
        hasLower &&
        hasDigit &&
        hasSpecial &&
        noSpaces;
};

const validarFechaFutura = (fecha) => {
    const target = new Date(fecha);
    if (Number.isNaN(target.getTime())) return false;
    const ahora = new Date();
    return target.getTime() > ahora.getTime();
};

/**
 * Controlador para obtener todos los usuarios del sistema
 * Recupera la lista completa de usuarios desde Firebase y los retorna en formato JSON
 */
const obtenerUser = async (req, res) => {
    try {
        /**
         * Obtiene todos los documentos de la colección de usuarios
         */
        const userSnapshot = await db.collection('usuarios').get()
        console.log(userSnapshot)
        const user = []

        /**
         * Iterar sobre cada documento y construir el array de usuarios
         * incluyendo el ID del documento junto con sus datos
         */
        userSnapshot.forEach(doc => {
            user.push({
                id: doc.id,
                ...doc.data()
            })
        })

        /**
         * Retornar la lista de usuarios con el total de registros
         */
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

/**
 * Controlador para crear un nuevo usuario en el sistema
 * Valida los campos requeridos, hashea la contraseña y almacena el usuario en Firebase
 */
const crearUser = async (req, res) => {
    try {
        let { correo, contrasena, nombre, apellido, idRol } = req.body || {};

        /**
         * Validar que todos los campos requeridos estén presentes
         */
        if (!nombre || apellido === undefined || !contrasena || !correo || !idRol) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            });
        }

        /**
         * Normalizar el correo electrónico a minúsculas y eliminar espacios
         */
        const normalizarCorreo = (correo) => correo.toLowerCase().trim();

        correo = normalizarCorreo(correo);

        /**
         * Validar que el correo no exista aún
         */
        const emailExistente = await db.collection('usuarios').where('correo', '==', correo).limit(1).get();
        if (!emailExistente.empty) {
            return res.status(409).json({
                success: false,
                error: 'Ya existe un usuario con ese correo'
            });
        }

        /**
         * Validar complejidad de contraseña
         */
        if (!validarContrasena(contrasena)) {
            return res.status(400).json({
                success: false,
                error: 'Contraseña debe tener al menos 12 caracteres, minúsculas, mayúsculas, números y caracteres especiales, sin espacios'
            });
        }

        /**
         * Hashear la contraseña antes de almacenarla
         */
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        /**
         * Asignar rol de empleado por defecto si no se proporciona
         */
        idRol = idRol || "JN3KSuH83BfQrq314DHt";

        /**
         * Construir el objeto del nuevo usuario con estado activo por defecto
         */
        const newUser = {
            correo,
            contrasena: hashedPassword,
            nombre,
            apellido,
            idRol,
            estado: true
        };

        /**
         * Guardar el nuevo usuario en la colección de Firestore
         */
        const docRef = await db.collection('usuarios').add(newUser);

        /**
         * Retornar confirmación con los datos del usuario creado
         */
        const { contrasena: _, ...userSafe } = newUser;

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

/**
 * Controlador para actualizar los datos de un usuario existente
 * Permite actualizar parcial o totalmente los campos del usuario
 */
const actualizarUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { correo, contrasena, nombre, apellido, idRol } = req.body || {};

        /**
         * Validar que se proporcione el ID del usuario
         */
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "falta el ID del usuario"
            });
        }

        /**
         * Construir el objeto con solo los campos que se van a actualizar
         */
        const updatedData = {};

        if (correo !== undefined) {
            const nuevoCorreo = correo.toLowerCase().trim();
            const existe = await db.collection('usuarios').where('correo', '==', nuevoCorreo).limit(1).get();
            if (!existe.empty) {
                const encontrado = existe.docs[0];
                if (encontrado.id !== id) {
                    return res.status(409).json({
                        success: false,
                        error: 'El correo ya está en uso por otro usuario'
                    });
                }
            }
            updatedData.correo = nuevoCorreo;
        }

        if (contrasena !== undefined) {
            if (!validarContrasena(contrasena)) {
                return res.status(400).json({
                    success: false,
                    error: 'Contraseña debe tener al menos 12 caracteres, minúsculas, mayúsculas, números y caracteres especiales, sin espacios'
                });
            }
            const saltRounds = 10;
            updatedData.contrasena = await bcrypt.hash(contrasena, saltRounds);
        }

        if (nombre !== undefined) updatedData.nombre = nombre;
        if (apellido !== undefined) updatedData.apellido = apellido;
        if (idRol !== undefined) updatedData.idRol = idRol;

        /**
         * Validar que se haya enviado al menos un campo para actualizar
         */
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No se enviaron datos para actualizar"
            });
        }

        /**
         * Actualizar los datos del usuario en Firestore
         */
        if (Object.keys(updatedData).length > 0) {
            const userRef = db.collection('usuarios').doc(id);
            await userRef.update(updatedData);
        }

        /**
         * Retornar confirmación con los datos actualizados
         */
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

/**
 * Controlador para actualizar únicamente el estado de un usuario
 * Permite activar o desactivar usuarios sin modificar otros campos
 */
const actualizarState = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body || {};

        /**
         * Validar que se proporcione el ID del usuario
         */
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "falta el ID del usuario"
            });
        }

        /**
         * Construir el objeto con el estado a actualizar
         */
        const updatedData = {};

        if (estado !== undefined) updatedData.estado = estado;

        /**
         * Validar que se haya proporcionado el estado
         */
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No se enviaron datos para actualizar"
            });
        }

        /**
         * Actualizar solo el estado del usuario en Firestore
         */
        const userRef = db.collection('usuarios').doc(id);
        await userRef.update(updatedData);

        /**
         * Retornar confirmación con el estado actualizado
         */
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

/**
 * Controlador para solicitar un código de verificación para cambio de contraseña
 * Genera un código aleatorio, lo almacena con tiempo de expiración y lo envía por correo
 */
const solicitarCambioContrasena = async (req, res) => {
    try {
        let { correo } = req.body || {};

        /**
         * Validar que se proporcione el correo electrónico
         */
        if (!correo) return res.status(400).json({ success: false, error: 'Falta el correo' });

        /**
         * Normalizar el correo electrónico a minúsculas y eliminar espacios
         */
        correo = correo.toLowerCase().trim();

        /**
         * Buscar el usuario por correo electrónico en la base de datos
         */
        const userQuery = await db.collection('usuarios').where('correo', '==', correo).limit(1).get();
        if (userQuery.empty) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

        const userDoc = userQuery.docs[0];

        /**
         * Generar un código de verificación aleatorio de 6 caracteres en hexadecimal
         */
        const codigo = crypto.randomBytes(3).toString('hex').toUpperCase();

        /**
         * Establecer tiempo de expiración del código en 15 minutos
         */
        const expiry = Date.now() + 15 * 60 * 1000;

        /**
         * Almacenar el código y su tiempo de expiración en el documento del usuario
         */
        await userDoc.ref.update({ resetCode: codigo, resetExpiry: expiry });

        /**
         * Configurar el transportador de correo con las credenciales SMTP
         */
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        /**
         * Configurar el contenido del correo electrónico con el código de verificación
         */
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

        /**
         * Verificar la conexión con el servidor SMTP antes de enviar
         */
        await transporter.verify().then(() => {
            console.log('Listo para enviar correos');
        });

        /**
         * Enviar el correo electrónico con el código de verificación
         */
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Código enviado al correo' });

    } catch (error) {
        console.error('Error en solicitarCambioContrasena:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * Controlador para cambiar la contraseña usando el código de verificación
 * Valida el código, verifica su expiración y actualiza la contraseña
 */
const cambiarContrasena = async (req, res) => {
    try {
        let { correo, codigo, nuevaContrasena } = req.body || {};

        /**
         * Validar que todos los campos requeridos estén presentes
         */
        if (!correo || !codigo || !nuevaContrasena) {
            return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
        }

        /**
         * Normalizar el correo electrónico a minúsculas y eliminar espacios
         */
        correo = correo.toLowerCase().trim();

        /**
         * Buscar el usuario por correo electrónico en la base de datos
         */
        const userQuery = await db.collection('usuarios').where('correo', '==', correo).limit(1).get();
        if (userQuery.empty) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

        const userDoc = userQuery.docs[0];
        const data = userDoc.data() || {};

        /**
         * Verificar que exista un código de verificación solicitado
         */
        if (!data.resetCode || !data.resetExpiry) {
            return res.status(400).json({ success: false, error: 'No hay un código solicitado' });
        }

        /**
         * Validar que el código proporcionado coincida con el almacenado
         */
        if (data.resetCode !== codigo) {
            return res.status(400).json({ success: false, error: 'Código inválido' });
        }

        /**
         * Verificar que el código no haya expirado
         */
        if (Date.now() > data.resetExpiry) {
            return res.status(400).json({ success: false, error: 'Código expirado' });
        }

        /**
         * Hashear la nueva contraseña antes de almacenarla
         */
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(nuevaContrasena, saltRounds);

        /**
         * Actualizar la contraseña y limpiar el código de verificación
         */
        await userDoc.ref.update({ contrasena: hashedPassword, resetCode: null, resetExpiry: null });

        /**
         * Retornar confirmación de cambio de contraseña exitoso
         */
        res.json({ success: true, message: 'Contraseña actualizada correctamente' });

    } catch (error) {
        console.error('Error en cambiarContrasena:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}



module.exports = {
    obtenerUser,
    crearUser,
    actualizarUser,
    actualizarState,
    solicitarCambioContrasena,
    cambiarContrasena
}