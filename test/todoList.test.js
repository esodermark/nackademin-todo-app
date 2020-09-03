// const TodoListModel = require('../models/TodoListModel')
// const TodoListController = require('../models/TodoListController')
const UserModel = require('../models/UserModel')
const UserController = require('../controllers/UserController')

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request, should } = chai

const app = require('../app')
require('dotenv').config()


describe('todoList Unit Tests', () => {
    this.currentTest = {}
    beforeEach(async () => {
        // TodoListModel.clear()
        await generateTestUser()
        const token = await generateToken()
        this.currentTest.token = token
    })
})



async function generateTestUser() {
    const username = process.env['USER_TEST']
    const password = process.env['HASHEDPASSWORD_TEST']
    const role =  process.env['ROLE_TEST']

    await UserModel.createUser(username, password, role)
}

async function generateToken() {
    const loginAttempt = {
        username: process.env['USER_TEST'],
        passwordAttempt: process.env['PASSWORD_TEST']
    }

    const req = 
        await request(app)
        .post('/login')
        .send(loginAttempt)
    
    const token = req.body.token
    return token
}