const TodoListModel = require('../../models/TodoListModel')
const UserModel = require('../../models/UserModel')
const TodoModel = require('../../models/TodoModel')
const Database = require('../../database/dbConnection')

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../../app')
require('dotenv').config()

const helper = require('../helper')


describe('todoList Integration Tests', function () {
    this.currentTest = {} 

    before(async function() {
        await Database.connect()
    })

    beforeEach(async function() {
        await UserModel.clear()
        await TodoListModel.clear()
        await TodoModel.clear()

        const user = await helper.generateTestUser()
        const token = await generateToken()

        this.currentTest.token = token
        this.currentTest.user = user
    })

    it('should get all user documentation', async function () {
        const newTodoList = await helper.generateTodoList(this.test.user._id)
        const newTodoList2 = await helper.generateTodoList(this.test.user._id)

        await helper.generateTodos(3, newTodoList._id, this.test.user._id)
        await helper.generateTodos(2, newTodoList2._id, this.test.user._id)

        await request(app)
        .get(`/userDocumentation`)
        .set('Authorization', `Bearer ${this.test.token}`)
        .set('Content-Type', `application/json`)
        .then(function (res) {
            expect(res).to.have.status(200)
            expect(res).to.be.json

            expect(res.body.user).to.be.an('object')
            expect(res.body.user).to.have.keys(['username', 'password', '_id', 'role'])

            expect(res.body.todoLists.length).to.equal(2)
            expect(res.body.todoLists[0]).to.have.keys(['todos', '_id', 'ownerId', 'title'])

            expect(res.body.todoLists[0].todos.length).to.equal(3)
        })
        .catch(function (err) {
            throw err;
         });    

    })
})

async function generateToken() {
    const loginAttempt = {
        username: process.env.USER_TEST,
        passwordAttempt: process.env.PASSWORD_TEST
    }

    const req = 
        await request(app)
        .post('/login')
        .send(loginAttempt)
    
    const token = req.body.token

    return token
}