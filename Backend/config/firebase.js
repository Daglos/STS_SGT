const admin = require('firebase-admin')
const serviceAccount = require('../proyectoprimerparcial-e9949-firebase-adminsdk-fbsvc-8cc2f33d24.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

module.exports = { db, admin }