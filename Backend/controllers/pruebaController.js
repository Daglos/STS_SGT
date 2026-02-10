const { db } = require('../config/firebase')

/**
 * Controlador de prueba para obtener todas las tareas del sistema
 * Recupera la lista completa de tareas desde Firebase y las retorna en formato JSON
 */
const obtenerprueba = async (req, res) => {
    try {
        /**
         * Obtener todos los documentos de la colección de tareas
         */
        const rolesSnapshot = await db.collection('tareas').get()
        console.log(rolesSnapshot)
        const prueba = []

        /**
         * Iterar sobre cada documento y construir el array de tareas
         * incluyendo el ID del documento junto con sus datos
         */
        rolesSnapshot.forEach(doc => {
            prueba.push({
                id: doc.id,
                ...doc.data()
            })
        })

        /**
         * Retornar la lista de tareas con el total de registros
         */
        res.json({
            success: true,
            data: prueba,
            total: prueba.length
        })
    }
    catch (error) {
        console.error('Error al obtener las tareas:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}


module.exports = {
    obtenerprueba
}