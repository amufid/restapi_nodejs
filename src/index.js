const express = require('express')
const usersRoutes = require('./routes/users.js')
const middlewareLogRequest = require('./middleware/logs.js')
const upload = require('./middleware/multer')
const PORT = process.env.PORT || 4000
require('dotenv').config()

const app = express()

app.use(middlewareLogRequest)
app.use(express.json())

app.use('/users', usersRoutes)
app.use('/assets', express.static('public/image'))
app.post('/upload', upload.single('photo'),(req, res) => {
  res.json({
    message: 'Upload berhasil'
  })
})

app.use((err, req, res, next) => {
  res.json({
    message: err.message
  })
})

// menjalankan server 
app.listen(PORT, () => {
  console.log(`Server berhasil running di port ${PORT}`)
})
