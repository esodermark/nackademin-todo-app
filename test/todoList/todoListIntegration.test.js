const TodoListModel = require('../../models/TodoListModel')
const UserModel = require('../../models/UserModel')
const TodoModel = require('../../models/TodoModel')

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../../app')
require('dotenv').config()

const helper = require('./helper')


describe('todoList Integration Tests', () => {
    this.currentTest = {}

    beforeEach(async function() {
        await UserModel.clear()

        const user = await helper.generateTestUser()
        const token = await generateToken()

        this.currentTest.token = token
        this.currentTest.user = user
    })


    it('should create a todoList', function () {
        const newTodoList = {
            title: 'Todo List Title'
        }

        chai.request(app)
        .post('/todoList')
        .set('Authorization', `Bearer ${this.test.token}`)
        .set('Content-Type', `application/json`)
        .send(newTodoList)
        .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res.body).to.have.keys('title', 'ownerId', '_id')

            TodoListModel.clear()
         })
         .catch(function (err) {
            throw err;
         });
    })


    it('should get all authorized to read todoLists with associated todos', async function() {
        const newTodoList = await helper.generateTodoList(this.test.user._id)
        const newTodoList2 = await helper.generateTodoList('unauthorized userId')

        await helper.generateTodos(3, newTodoList._id, this.test.user._id)
        await helper.generateTodos(2, newTodoList2._id, this.test.user._id)
        
        chai.request(app)
        .get(`/todoLists`)
        .set('Authorization', `Bearer ${this.test.token}`)
        .set('Content-Type', `application/json`)
        .then(function (res) {
            console.log(res.body[0].todos)
            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res.body[0]).to.have.keys('title', 'ownerId', '_id', 'todos')
            expect(res.body.length).to.equal(2)

            TodoListModel.clear()
        })
        .catch(function (err) {
            throw err;
         });     
    })


    it('should get a todoList with associated todos by id', async function () {
        const newTodoList = await helper.generateTodoList(this.test.user._id)
        const todos = await helper.generateTodos(3, newTodoList._id, this.test.user._id)

        chai.request(app)
        .get(`/todoList/${newTodoList._id}`)
        .set('Authorization', `Bearer ${this.test.token}`)
        .set('Content-Type', `application/json`)
        .then(function (res) {

            console.log(res.body)

            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res.body.todoList).to.have.keys(Object.keys(newTodoList))
            expect(res.body.todos[0]).to.have.keys(Object.keys(todos[0]))

            TodoListModel.clear()
        })
        .catch(function (err) {
            throw err;
         });
    })


    it('should update a todoList title by id', async function () {
        const newTodoList = await helper.generateTodoList(this.test.user._id)

        chai.request(app)
        .patch(`/todoList/${newTodoList._id}`)
        .set('Authorization', `Bearer ${this.test.token}`)
        .set('Content-Type', `application/json`)
        .send(newTodoList)
        .then(function (res) {
            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res.body).to.equal(1)

            TodoListModel.clear()
        })
        .catch(function (err) {
            throw err;
         });
    })


    it('should delete a todoList with associated todos by id', async function() {
        const newTodoList = await helper.generateTodoList(this.test.user._id)
        await helper.generateTodos(3, newTodoList._id, this.test.user._id)

        chai.request(app)
        .delete(`/todoList/${newTodoList._id}`)
        .set('Authorization', `Bearer ${this.test.token}`)
        .set('Content-Type', `application/json`)
        .then(function (res) {
            expect(res).to.have.status(200)
            expect(res).to.be.json
            expect(res.body.numTodoListsRemoved).to.equal(1)
            expect(res.body.numTodosRemoved).to.equal(3)

            TodoListModel.clear()
        })
        .catch(function (err) {
            throw err;
         });
    })
})


async function generateToken() {
    const loginAttempt = {
        username: process.env['USER_TEST'],
        passwordAttempt: process.env['PASSWORD_TEST']
    }

    const req = 
        await chai.request(app)
        .post('/login')
        .send(loginAttempt)
    
    const token = req.body.token

    return token
}