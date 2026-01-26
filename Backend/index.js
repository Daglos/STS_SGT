const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT 
const rolRoute = require('./routes/rolRoute')
const userRoute = require('./routes/userRoute')
const taskRoute = require('./routes/taskRoute')
const logginRoute = require('./routes/loginRoute')

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