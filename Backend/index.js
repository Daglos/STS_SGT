const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT 
const rolesRoute = require('./routes/rolesRoute')
const userRoute = require('./routes/userRoute')
const taskRoute = require('./routes/taskRoute')


app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hellor World!')
})

app.use('/roles',rolesRoute)
app.use('/user',userRoute)
app.use('/task',taskRoute)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})