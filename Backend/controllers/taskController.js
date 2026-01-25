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


module.exports = {
    obtenerTasks
}