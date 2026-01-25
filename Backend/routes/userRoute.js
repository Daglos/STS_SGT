const express = require('express')
const router = express.Router()


const {obtenerUser, crearUser} = require('../controllers/userController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})


router.get('/obtenerUsers',obtenerUser)
router.post('/crearUsers',crearUser)


module.exports = router