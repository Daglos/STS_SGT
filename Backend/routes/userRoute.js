const express = require('express')
const router = express.Router()


const {obtenerUser, crearUser, actualizarUser, actualizarState, solicitarCambioContrasena, cambiarContrasena} = require('../controllers/userController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})


router.get('/obtenerUsers',obtenerUser)
router.post('/crearUsers',crearUser)
router.put('/actualizarUsers',actualizarUser)
router.put('/actualizarState',actualizarState)
router.post('/solicitarCambioContrasena', solicitarCambioContrasena)
router.put('/cambiarContrasena', cambiarContrasena)

module.exports = router