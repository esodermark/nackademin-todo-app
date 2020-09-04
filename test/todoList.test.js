const TodoListModel = require('../models/TodoListModel')
const TodoListController = require('../models/TodoListController')
const UserModel = require('../models/UserModel')
const UserController = require('../controllers/UserController')
const TodoModel = require('../models/TodoModel')

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request, should } = chai

const app = require('../app')
require('dotenv').config()


describe('todoList Unit Tests', () => {
    this.currentTest = {}
    beforeEach(async () => {
        TodoListModel.clear()

        const user = await generateTestUser()
        const token = await generateToken()

        this.currentTest.token = token
        this.currentTest.user = user
    })

    it('should create a todoList', async () => {
        const todoList = {
            title: 'Todo List Title',
            ownerId: this.currentTest.user._id
        }

        const createdTodoList = await TodoListModel.postTodoList(todoList)
        createdTodoList.title.should.equal('Todo List Title')
    })

    it('should get a todoList by id', async () => {
        const newTodoList = {
            title: 'Todo List Title',
            ownerId: this.currentTest.user._id,
            id: '1'
        }
        await TodoListModel.postTodoList(newTodoList)
        const newTodo = {
            title: 'Todo Title',
            done: false,
            ownerId: this.currentTest.user._id,
            listId: newTodoList.id
        }
        await TodoModel.postTodo(newTodo)
        const newTodo2 = {
            title: 'Todo Title 2',
            done: false,
            ownerId: this.currentTest.user._id,
            listId: newTodoList.id
        }
        await TodoModel.postTodo(newTodo)
        await TodoModel.postTodo(newTodo2)

        const todoList = await TodoListModel.getTodoListById(newTodoList.id)
        todoList.todoList.should.eql(newTodoList)
        todoList.getTodos(newTodoList.id).should.eql(
            [
                newTodo,
                newTodo2
            ]
        )
        todoList.isOwner(this.currentTest.user).should.equal(true)
    })

    it('should update todoList title by id', async () => {
        const newTodoList = {
            title: 'Todo List Title',
            ownerId: this.currentTest.user._id,
            id: '1'
        }
        await TodoListModel.postTodoList(newTodoList)

        const title = 'New Todo List Title'
        const id = newTodoList.id

        const updatedTodoList = await TodoListModel.updateTodoListTitleById(id, title)
        updatedTodoList.title.should.equal('New Todo List Title')
    })
})



async function generateTestUser() {
    const username = process.env['USER_TEST']
    const password = process.env['HASHEDPASSWORD_TEST']
    const role =  process.env['ROLE_TEST']

    const user = await UserModel.createUser(username, password, role)
    return user
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