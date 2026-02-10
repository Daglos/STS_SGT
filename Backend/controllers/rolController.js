const { db } = require('../config/firebase')

/**
 * Controlador para obtener todos los roles del sistema
 * Recupera la lista completa de roles desde Firebase y los retorna en formato JSON
 */
const obtenerRols = async (req, res) => {
    try {
        /**
         * Obtener todos los documentos de la colección de roles
         */
        const rolesSnapshot = await db.collection('roles').get()
        console.log(rolesSnapshot)
        const roles = []

        /**
         * Iterar sobre cada documento y construir el array de roles
         * incluyendo el ID del documento junto con sus datos
         */
        rolesSnapshot.forEach(doc => {
            roles.push({
                id: doc.id,
                ...doc.data()
            })
        })

        /**
         * Retornar la lista de roles con el total de registros
         */
        res.json({
            success: true,
            data: roles,
            total: roles.length
        })
    }
    catch (error) {
        console.error('Error al obtener los roles:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}


module.exports = {
    obtenerRols
}