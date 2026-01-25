const express = require('express')
const router = express.Router()


const {obtenerTasks} = require('../controllers/taskController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})


router.get('/obtenerTasks',obtenerTasks)


module.exports = router