const TodoListModel = require('../models/TodoListModel')
// const TodoListController = require('../models/TodoListController')
const UserModel = require('../models/UserModel')
const UserController = require('../controllers/UserController')
const TodoModel = require('../models/TodoModel')

const chai = require('chai')
require('chai').should();
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../app')
require('dotenv').config()


describe('todoList Unit Tests', () => {
    this.currentTest = {}

    beforeEach(async function() {
        TodoListModel.clear()
        TodoModel.clear()
        UserModel.clear()

        const user = await generateTestUser()
        this.currentTest.user = user
    })


    it('should create a todoList', async function() {
        const newTodoList = await generateTodoList(this.test.user._id)

        newTodoList.title.should.equal('Todo List Title')
    })


    it('should get a todoList with associated todos by id', async function() {
        const newTodoList = await generateTodoList()
        const newTodos = await generateTodos(2, newTodoList._id, this.test.user._id)

        const todoList = await TodoListModel.getTodoListById(newTodoList._id)
        const todos = await todoList.getTodos(newTodoList._id)

        todoList.todoList.should.eql(newTodoList)
        todos.should.eql(newTodos)
        todoList.isOwner(this.test.user).should.equal(true)
    })


    it('should update todoList title by id', async () => {
        const newTodoList = await generateTodoList()

        const title = 'New Todo List Title'
        const id = newTodoList._id

        const numUpdated = await TodoListModel.updateTodoListTitleById(id, title)
        numUpdated.should.equal(1)
    })


    it('should delete a todoList with associated todos by id', async() => {
        const newTodoList = await generateTodoList()
        await generateTodos(3, newTodoList._id)

        const deletedTodoList = await TodoListModel.deleteTodoListById(newTodoList._id)
        const numRemovedTodos = await deletedTodoList.deleteTodos(newTodoList._id)
        const deletedTodos = await tryFetchDeletedTodos(newTodoList._id)

        deletedTodoList.numRemoved.should.equal(1)
        numRemovedTodos.should.equal(3)
        deletedTodos.length.should.equal(0)
    })
})

describe('todoList Integration Tests', () => {
    this.currentTest = {}

    beforeEach(async function() {
        TodoListModel.clear()
        TodoModel.clear()
        UserModel.clear()

        const user = await generateTestUser()
        const token = await generateToken()

        this.currentTest.token = token
        this.currentTest.user = user
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

async function generateTodoList(userId) {
    const newTodoList = {
        title: 'Todo List Title',
        ownerId: userId,
        _id: '1'
    }
    const todoList = await TodoListModel.postTodoList(newTodoList)
    return todoList
}

async function generateTodos(quantity, todoListId, userId) {
    let todos = []
    for(i = 0; i < quantity; i++) {
        todos[i] = {
            title: `Todo Title ${i}`,
            done: false,
            ownerId: userId,
            listId: todoListId,
            _id: i
        }
        await TodoModel.postTodo(todos[i])
    }
    return todos
}

async function tryFetchDeletedTodos(todoListId) {
    const todoList = await TodoListModel.getTodoListById(todoListId)

    return todoList.getTodos(todoListId)
}