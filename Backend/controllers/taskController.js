const { db } = require('../config/firebase')

/**
 * Controlador para obtener todas las tareas del sistema
 * Recupera la lista completa de tareas desde Firebase y las retorna en formato JSON
 */
const obtenerTasks = async (req, res) => {
    try {
        /**
         * Obtener todos los documentos de la colección de tareas
         */
        const taskSnapshot = await db.collection('tareas').get()
        console.log(taskSnapshot)
        const user = []

        /**
         * Iterar sobre cada documento y construir el array de tareas
         * incluyendo el ID del documento junto con sus datos
         */
        taskSnapshot.forEach(doc => {
            user.push({
                id: doc.id,
                ...doc.data()
            })
        })

        /**
         * Retornar la lista de tareas con el total de registros
         */
        res.json({
            success: true,
            data: user,
            total: user.length
        })
    }
    catch (error) {
        console.error('Error al obtener las tareas:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

/**
 * Controlador para buscar y filtrar tareas
 * Permite filtrar por usuario y estado 
 */

const filtrarTasks = async (req, res) => {}

/**
 * Controlador para obtener las tareas asignadas a un usuario específico
 * Filtra las tareas por ID de empleado y retorna solo las que le corresponden
 */
const obtenerTaskPorId = async (req, res) => {
    try {
        const { idUsuario } = req.query;

        /**
         * Validar que se proporcione el ID del usuario
         */
        if (!idUsuario) {
            return res.status(400).json({
                success: false,
                error: "Falta el ID del usuario"
            });
        }

        /**
         * Consultar las tareas filtradas por el ID del empleado
         */
        const taskSnapshot = await db.collection('tareas').where('idEmpleado', '==', idUsuario).get();
        const tasks = [];

        /**
         * Construir el array con las tareas encontradas
         */
        taskSnapshot.forEach(doc => {
            tasks.push({
                id: doc.id,
                ...doc.data()
            });
        });

        /**
         * Retornar las tareas del usuario específico
         */
        return res.json({
            success: true,
            data: tasks,
            total: tasks.length
        });

    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Controlador para crear una nueva tarea en el sistema
 * Valida los campos requeridos y almacena la tarea en Firebase con estado inicial activo
 */
const crearTask = async (req, res) => {
    try {
        const { idEmpleado, idJefe, titulo, descripcion, fechaLimite} = req.body || {}

        /**
         * Validar que todos los campos requeridos estén presentes
         */
        if (!idEmpleado || idJefe === undefined || !titulo || !descripcion || !fechaLimite) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            })
        }

        /**
         * Construir el objeto de la nueva tarea con estado inicial
         */
        const newTask = {
            idEmpleado,
            idJefe,
            titulo,
            descripcion,
            fechaLimite,
            estado: 'activo'
        }

        /**
         * Agregar la nueva tarea a la colección en Firebase
         */
        const docRef = await db.collection('tareas').add(newTask)

        /**
         * Retornar confirmación con los datos de la tarea creada
         */
        res.status(201).json({
            success: true,
            message: 'Tarea agregada exitosamente',
            data: {
                id: docRef.id,
                ...newTask
            }
        })
    }
    catch (error) {
        console.error('Error al agregar la tarea:', error)  
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

/**
 * Controlador para actualizar los datos de una tarea existente
 * Permite actualizar parcial o totalmente los campos de la tarea
 */
const actualizarTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { idEmpleado, idJefe, titulo, descripcion, fechaLimite, estado } = req.body || {};

        /**
         * Validar que se proporcione el ID de la tarea
         */
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "falta el ID de la tarea"
            });
        }

        /**
         * Construir el objeto con solo los campos que se van a actualizar
         */
        const updatedData = {};

        if (idEmpleado !== undefined) updatedData.idEmpleado = idEmpleado;
        if (idJefe !== undefined) updatedData.idJefe = idJefe;
        if (titulo !== undefined) updatedData.titulo = titulo;
        if (descripcion !== undefined) updatedData.descripcion = descripcion;
        if (fechaLimite !== undefined) updatedData.fechaLimite = fechaLimite;
        if (estado !== undefined) updatedData.estado = estado;

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
         * Actualizar la tarea en Firebase con los nuevos datos
         */
        const taskRef = db.collection('tareas').doc(id);
        await taskRef.update(updatedData);

        /**
         * Retornar confirmación con los datos actualizados
         */
        res.status(200).json({
            success: true,
            message: 'Tarea actualizada correctamente',
            data: { id, ...updatedData }
        });

    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Controlador para actualizar únicamente el estado de una tarea
 * Permite cambiar el estado de la tarea sin modificar otros campos
 */
const actualizarState = async (req, res) => {
    try {
        const { id } = req.query;
        const { estado} = req.body || {};

        /**
         * Validar que se proporcione el ID de la tarea
         */
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "falta el ID del estado"
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
         * Actualizar solo el estado de la tarea en Firebase
         */
        const taskRef = db.collection('tareas').doc(id);
        await taskRef.update(updatedData);

        /**
         * Retornar confirmación con el estado actualizado
         */
        res.status(200).json({
            success: true,
            message: 'Estado actualizado correctamente',
            data: { id, ...updatedData }
        });

    } catch (error) {
        console.error('Error al actualizar el estado:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


module.exports = {
    obtenerTasks,
    obtenerTaskPorId,
    crearTask,
    actualizarTask,
    actualizarState
}