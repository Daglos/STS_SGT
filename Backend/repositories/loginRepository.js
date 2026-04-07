const db = require('../config/db');

/**
 * Repositorio para manejar la lógica de acceso a datos relacionada con el login
 */
const obtenerPorCorreo = async (correo) => {
    // Realizar una consulta a Firestore para obtener el usuario por correo
    const querySnapshot = await db
        .collection('usuarios')
        .where('correo', '==', correo)
        .limit(1)
        .get();

    if (querySnapshot.empty) return null;

    const documento = querySnapshot.docs[0];
    
    // Retornar un objeto con la información del usuario, incluyendo el ID del documento
    return {
        id: documento.id,
        ...documento.data()
    };
};

module.exports = { obtenerPorCorreo };