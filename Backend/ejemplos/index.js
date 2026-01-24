const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT 
const ventasRoute= require('./routes/ventasRoute')
const testRouter = require('./routes/test')
const productosRouter = require('./routes/productosRoute')

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/test', testRouter)
app.use('/productos',productosRouter)
app.use('/ventas',ventasRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
