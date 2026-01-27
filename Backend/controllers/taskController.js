const { db } = require('../config/firebase')

const obtenerTasks = async (req, res) => {
    try {
        const taskSnapshot = await db.collection('tareas').get()
        console.log(taskSnapshot)
        const user = []

        taskSnapshot.forEach(doc => {
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
        console.error('Error al obtener las tareas:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

// Usa query para para filtrar
const obtenerTaskPorId = async (req, res) => {
    try {
        const { idUsuario } = req.query;

        if (!idUsuario) {
            return res.status(400).json({
                success: false,
                error: "Falta el ID del usuario"
            });
        }

        // let idUsuario = "Bj4sc1huaXob4KziNrpq"; Este es solo de prueba 
        const taskSnapshot = await db.collection('tareas').where('idEmpleado', '==', idUsuario).get();
        const tasks = [];

        taskSnapshot.forEach(doc => {
            tasks.push({
                id: doc.id,
                ...doc.data()
            });
        });

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


const crearTask = async (req, res) => {
    // try {
    //     const sampleTask = {
    //         idEmpleado: "EMP.TEST",
    //         idJefe: "JEF.TEST",
    //         titulo: "Tarea de prueba",
    //         descripcion: "Generada sin datos desde backend",
    //         fechaLimite: new Date().toISOString()
    //     }

    //     const docRef = await db.collection('tareas').add(sampleTask);

    //     res.status(201).json({
    //         success: true,
    //         message: 'Tarea creada sin datos desde backend (test)',
    //         data: { id: docRef.id, ...sampleTask }
    //     })
    // } catch (error) {
    //     res.status(500).json({ success: false, error: error.message })
    // }

    try {
        const { idEmpleado, idJefe, titulo, descripcion, fechaLimite} = req.body || {}

        //  Validación básica
        if (!idEmpleado || idJefe === undefined || !titulo || !descripcion || !fechaLimite) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            })
        }

        const newTask = {
            idEmpleado,
            idJefe,
            titulo,
            descripcion,
            fechaLimite,
            estado: true
        }

        const docRef = await db.collection('tareas').add(newTask)

        //  Devolver el ID de la terea creada
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
        console.error('Error al agregar la tarea:', error)  //  Log del error
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

// Aqui falta probar a editar/actualizar desde frontend como pasar el id del documento/registro
// Usa params
const actualizarTask = async (req, res) => {
    //     try {
    //         // id existente
    //     const taskIdTest = "Bj4sc1huaXob4KziNrpq";

    //     // prueba
    //     const updateSample = {
    //         titulo: "Título actualizado desde backend (test)",
    //         descripcion: "Actualizado desde backend sin foraneas",
    //         fechaLimite: new Date().toISOString()
    //     };

    //     const taskRef = db.collection('tareas').doc(taskIdTest);
    //     await taskRef.update(updateSample);

    //     res.status(200).json({
    //         success: true,
    //         message: "Tarea actualizada desde backend (test)",
    //         data: { id: taskIdTest, ...updateSample }
    //     });

    // } catch (error) {
    //     console.error("Error al actualizar la tarea:", error);
    //     res.status(500).json({
    //         success: false,
    //         error: error.message
    //     });
    // }


    try {
        const { id } = req.params;
        const { idEmpleado, idJefe, titulo, descripcion, fechaLimite, estado } = req.body || {};

        // Validar que se envió ID
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "falta el ID de la tarea"
            });
        }

        // Construir objeto con los campos que fueron enviados
        const updatedData = {};

        if (idEmpleado !== undefined) updatedData.idEmpleado = idEmpleado;
        if (idJefe !== undefined) updatedData.idJefe = idJefe;
        if (titulo !== undefined) updatedData.titulo = titulo;
        if (descripcion !== undefined) updatedData.descripcion = descripcion;
        if (fechaLimite !== undefined) updatedData.fechaLimite = fechaLimite;
        if (estado !== undefined) updatedData.estado = estado;

        // Verificar que haya un campo para actualizar
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No se enviaron datos para actualizar"
            });
        }

        const taskRef = db.collection('tareas').doc(id);
        await taskRef.update(updatedData);

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

// usa params
const actualizarState = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado} = req.body || {};

        // Validar que se envió ID
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "falta el ID del estado"
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

        const taskRef = db.collection('tareas').doc(id);
        await taskRef.update(updatedData);

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