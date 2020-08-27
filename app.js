const express = require('express')
const router = require('./routes/index.js')
const cors = require('cors')

const app = express()

// Middleware
app.use(cors())
var bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use('/', router.todoRouter)
app.use('/', router.userRouter)

// Start Server
const PORT = 3000
app.listen(PORT, () => console.log(`Server started at port ${PORT}`))