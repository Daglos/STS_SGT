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
        const { idEmpleado, idJefe, titulo, descripcion, fechaLimite } = req.body || {}

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
            fechaLimite
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


module.exports = {
    obtenerTasks,
    crearTask
}