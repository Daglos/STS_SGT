const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 3000

console.log('Loading routes...')
try {
  const rolRoute = require('./routes/rolRoute')
  const userRoute = require('./routes/userRoute')
  const taskRoute = require('./routes/taskRoute')
  const logginRoute = require('./routes/loginRoute')
  console.log('Routes loaded successfully')

  //Esto lo usaremos solo en desarrollo por temas de seguridad hay que configurarlo en el deploy
  //Con este codigo permite el backend hacer fetch de datos desde cualquier dominio
  app.use(cors({
    origin: '*', // Permitir todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }));

  app.use(express.json())

  app.get('/', (req, res) => {
    res.send('Hellor World!')
  })

  app.use('/rol',rolRoute)
  app.use('/user',userRoute)
  app.use('/task',taskRoute)
  app.use('/login',logginRoute)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
} catch (error) {
  console.error('Error loading application:', error.message)
  console.error(error)
}