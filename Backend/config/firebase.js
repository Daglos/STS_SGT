const admin = require('firebase-admin')
const serviceAccount = require('../proyectoprimerparcial-e9949-firebase-adminsdk-fbsvc-8cc2f33d24.json')

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