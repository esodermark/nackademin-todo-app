const UserModel = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secret = 'schhhhh, do not tell'

module.exports = {

    createUserCallback: async (req, res) => {
        const { 
                username, 
                password, 
                role
            } = req.body 

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        try {
            const user = await UserModel.createUser(
                username,
                hashedPassword,
                role
            )
            res.json(`Created user ${user.username} successfully`).status(200)
        } catch (error) {
            res.json('User could not be created')
            console.log(error)
        }
    },
}