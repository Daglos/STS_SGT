const express = require('express')
const router = express.Router()

const { iniciarSesion } = require('../controllers/loginController')

// Ruta de prueba
router.get('/', (req, res) => {
  res.send('Archivo login funcionando' )
})

// Login no necesita de token
router.post('/login', iniciarSesion)

module.exports = router