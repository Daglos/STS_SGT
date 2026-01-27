const express = require('express')
const router = express.Router()


const {iniciarSesion} = require('../controllers/loginController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})

router.post('/login',iniciarSesion)

module.exports = router