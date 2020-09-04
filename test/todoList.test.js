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
        const newTodoList = await generateTodoList()

        const createdTodoList = await TodoListModel.postTodoList(newTodoList)
        createdTodoList.title.should.equal('Todo List Title')
    })

    it('should get a todoList by id', async () => {
        const newTodoList = await generateTodoList()
        const newTodos = await generateTodos(2, newTodoList._id)

        const todoList = await TodoListModel.getTodoListById(newTodoList._id)

        todoList.todoList.should.eql(newTodoList)
        todoList.getTodos(newTodoList.id).should.eql(newTodos)
        todoList.isOwner(this.currentTest.user).should.equal(true)
    })

    it('should update todoList title by id', async () => {
        const newTodoList = await generateTodoList()

        const title = 'New Todo List Title'
        const id = newTodoList._id

        const updatedTodoList = await TodoListModel.updateTodoListTitleById(id, title)
        updatedTodoList.title.should.equal('New Todo List Title')
    })

    it('should delete a todoList with associated todos', async() => {
        const newTodoList = await generateTodoList()
        const newTodos = await generateTodoList(3, newTodoList._id)

        const numDeleted = await TodoListModel.deleteTodoListById(newTodoList._id)
        const todos = tryFetchDeletedTodos(newTodoList._id)

        numDeleted.should.equal(1)
        todos.should.equal({error: 'no todos with this TodoListId'})
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

async function generateTodoList() {
    const newTodoList = {
        title: 'Todo List Title',
        ownerId: this.currentTest.user._id,
        _id: '1'
    }
    const todoList = await TodoListModel.postTodoList(newTodoList)
    return todoList
}

async function generateTodos(quantity, todoListId) {
    let todos = []
    for(i = 1; i <= quantity; i++) {
        todos[i] = {
            title: `Todo Title ${i}`,
            done: false,
            ownerId: this.currentTest.user._id,
            listId: newTodoList.id
        }
        await TodoModel.postTodo(todos[i])
    }
    return todos
}

async function tryFetchDeletedTodos(todoListId) {
    const todoList = await TodoListModel.getTodoListById(todoListId)

    return todoList.getTodos(todoListId)
}