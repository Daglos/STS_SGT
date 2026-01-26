const { db } = require('../config/firebase')

const obtenerprueba = async (req, res) => {
    try {
        const rolesSnapshot = await db.collection('tareas').get()
        console.log(rolesSnapshot)
        const prueba = []

        rolesSnapshot.forEach(doc => {
            prueba.push({
                id: doc.id,
                ...doc.data()
            })
        })

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