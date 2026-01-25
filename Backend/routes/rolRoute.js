const express = require('express')
const router = express.Router()


const {obtenerRols} = require('../controllers/rolController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})


router.get('/obtenerRols',obtenerRols)


module.exports = router