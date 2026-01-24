const express = require('express')
const router = express.Router()


const {obtenerProductos,crearProductos} = require('../controllers/productosController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})


router.get('/obtenerProductos',obtenerProductos)


router.post('/crearProductos', crearProductos)

module.exports = router