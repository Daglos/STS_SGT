const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 3000

console.log('Loading routes...')
try {
  /**
   * Importar las rutas de los diferentes módulos del sistema
   */
  const rolRoute = require('./routes/rolRoute')
  const userRoute = require('./routes/userRoute')
  const taskRoute = require('./routes/taskRoute')
  const logginRoute = require('./routes/loginRoute')

   // ---------- NUEVO: ruta de grupos de tareas ----------
  const taskGroupRoute = require('./routes/taskGroupRoute')

  // ---------- NUEVO: ruta de grupos de empleados ----------
  const groupRoute = require('./routes/groupRoute');

  console.log('Routes loaded successfully')

  /**
   * Configurar CORS para permitir peticiones desde cualquier origen
   * Esta configuración debe ser modificada en producción por temas de seguridad
   */
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }));

  /**
   * Middleware para parsear el body de las peticiones como JSON
   */
  app.use(express.json())

  /**
   * Ruta raíz de prueba para verificar que el servidor esté funcionando
   */
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  /**
   * Registrar las rutas de los diferentes módulos con sus respectivos prefijos
   */
  app.use('/rol', rolRoute)
  app.use('/user', userRoute)
  app.use('/task', taskRoute)
  app.use('/login', logginRoute)

  // ---------- NUEVO: registrar ruta de grupos de tareas ----------
  app.use('/task-groups', taskGroupRoute)

  app.use('/grupo', groupRoute);

  /**
   * Iniciar el servidor en el puerto especificado
   */
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

} catch (error) {
  console.error('Error loading application:', error.message)
  console.error(error)
}