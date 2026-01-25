const express = require('express')
const router = express.Router()


const {obtenerRoles} = require('../controllers/rolesController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})


router.get('/obtenerRoles',obtenerRoles)


module.exports = router