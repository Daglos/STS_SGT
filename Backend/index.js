const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT 
const rolesRoute = require('./routes/rolesRoute')


app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hellor World!')
})

app.use('/roles',rolesRoute)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})