const express = require('express')
const router = express.Router()


const {obtenerprueba} = require('../controllers/pruebaController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})


router.get('/obtenerprueba',obtenerprueba)


module.exports = router