const express = require('express')
const router = express.Router()


const {iniciarSesion} = require('../controllers/logginController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})

router.post('/loggin',iniciarSesion)

module.exports = router