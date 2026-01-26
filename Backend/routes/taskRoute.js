const express = require('express')
const router = express.Router()


const {obtenerTasks, crearTask, actualizarTask} = require('../controllers/taskController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})


router.get('/obtenerTasks',obtenerTasks)

router.post('/crearTask',crearTask)

router.put('/actualizarTask',actualizarTask)

//Actualizar estado

module.exports = router