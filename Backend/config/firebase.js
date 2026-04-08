const admin = require('firebase-admin')
const serviceAccount = require('../proyectofb-fb9c5-firebase-adminsdk-fbsvc-f5381eb16f.json')

/**
 * Inicializar la aplicación de Firebase Admin SDK
 * utilizando las credenciales del archivo de cuenta de servicio
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

/**
 * Obtener la instancia de Firestore para interactuar con la base de datos
 */
const db = admin.firestore()

module.exports = { db, admin }