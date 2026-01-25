const { db } = require('../config/firebase')

const obtenerRoles = async (req, res) => {
    try {
        const rolesSnapshot = await db.collection('roles').get()
        console.log(rolesSnapshot)
        const roles = []

        rolesSnapshot.forEach(doc => {
            roles.push({
                id: doc.id,
                ...doc.data()
            })
        })

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
    obtenerRoles
}