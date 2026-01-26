const express = require('express')
const router = express.Router()


const {obtenerUser, crearUser, actualizarUser, actualizarState} = require('../controllers/userController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})


router.get('/obtenerUsers',obtenerUser)
router.post('/crearUsers',crearUser)
router.put('/actualizarUsers',actualizarUser)
router.put('/actualizarState',actualizarState)

module.exports = router