const express = require('express')
const router = express.Router()


const {obtenerTasks, crearTask} = require('../controllers/taskController')


router.get('/', (req, res) => {
  res.send('Archivo sell funcionando' )
})


router.get('/obtenerTasks',obtenerTasks)

router.post('/crearTask',crearTask)


module.exports = router