const express = require('express')
const router = require('./routes/router.js')

const app = express()

// Middleware
var bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use('/', router)

// Start Server
const PORT = 3000
app.listen(PORT, () => console.log(`Server started at port ${PORT}`))