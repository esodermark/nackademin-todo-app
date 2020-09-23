const UserModel = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const permissions = require('../permissions/todoPermissions')
require('dotenv').config()

const secret = process.env.SECRET

module.exports = {
    createUserCallback: async (req, res) => {
        if(!permissions.canCreateUser(req.user)) {return res.sendStatus(401)}
        
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

    loginUserCallback: async (req, res) => {
        const {
            username,
            passwordAttempt
        } = req.body

        try {
            const user = await UserModel.loginUser(username)
            const success = await bcrypt.compare(passwordAttempt, user.password)
            
            if(success) {
                const token = jwt.sign(user, secret)
                res.json({token}).status(200) 
            } else {
                res.json('Wrong password')
            }
        } catch(error) {
            res.json(error)
            console.log(error)
        }
    }
}