const app = require('./app')
const {connect} = require('./database/dbConnection');

// Start Server
const PORT = process.env.PORT
app.listen(PORT, async () => {
    await connect()
    console.log(`Server started at port ${PORT}`)
})