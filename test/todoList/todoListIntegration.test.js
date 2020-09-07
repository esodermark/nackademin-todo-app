const TodoListModel = require('../../models/TodoListModel')
const UserModel = require('../../models/UserModel')
const TodoModel = require('../../models/TodoModel')

const chai = require('chai')
require('chai').should();
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../../app')
require('dotenv').config()

const helper = require('./helper')


describe('todoList Integration Tests', () => {
    this.currentTest = {}

    beforeEach(async function() {
        TodoListModel.clear()
        TodoModel.clear()
        UserModel.clear()

        const user = await helper.generateTestUser()
        const token = await generateToken()

        this.currentTest.token = token
        this.currentTest.user = user
    })


    it('should create a todoList', async function () {
        const newTodoList = {
            title: 'Todo List Title'
        }

        request(app)
        .post('/todoList')
        .set('Authorization', `Bearer ${this.test.token}`)
        .set('Content-Type', `application/json`)
        .send(newTodoList, (err, res) => {
            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res.body).to.have.keys('title', 'ownerId', '_id')
        })

    })


    it('should get a todoList with associated todos by id', async function () {
        const newTodoList = await helper.generateTodoList(this.test.user._id)
        const todos = await helper.generateTodos(3, newTodoList._id, this.test.user._id)

        request(app)
        .get(`/todoList/${newTodoList._id}`)
        .set('Authorization', `Bearer ${this.test.token}`)
        .set('Content-Type', `application/json`)
        .send((err, res) => {
            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res.body.todoList).to.have.keys(Object.keys(newTodoList))
            expect(res.body.todos[0]).to.have.keys(Object.keys(todos[0]))
        })
    })


    it('should update a todoList title by id', async function () {
        const newTodoList = await helper.generateTodoList(this.test.user._id)

        request(app)
        .patch(`/todoList/${newTodoList._id}`)
        .set('Authorization', `Bearer ${this.test.token}`)
        .set('Content-Type', `application/json`)
        .send(newTodoList, (err, res) => {
            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res.body).to.equal(1)
        })
    })


    it('should delete a todoList with associated todos by id', async function() {
        const newTodoList = await helper.generateTodoList(this.test.user._id)
        await helper.generateTodos(4, newTodoList._id, this.test.user._id)

        request(app)
        .delete(`/todoList/${newTodoList._id}`)
        .set('Authorization', `Bearer ${this.test.token}`)
        .set('Content-Type', `application/json`)
        .send((err, res) => {
            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res.body.numTodoListsRemoved).to.equal(1)
            expect(res.body.numTodosRemoved).to.equal(4)
        })
    })
})


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