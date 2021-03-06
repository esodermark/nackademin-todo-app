const TodoListModel = require('../../models/TodoListModel')
const UserModel = require('../../models/UserModel')
const Database = require('../../database/dbConnection')

require('chai').should();
require('dotenv').config()

const helper = require('../helper')


describe('todoList Unit Tests', () => {
    this.currentTest = {}

    before(async function() {
        await Database.connect()
    })

    beforeEach(async function() {
        await UserModel.clear()
        await TodoListModel.clear()

        const user = await helper.generateTestUser()
        this.currentTest.user = user
    })

    it('should create a todoList', async function() {
        const newTodoList = await helper.generateTodoList(this.test.user._id)

        newTodoList.title.should.equal('Todo List Title')
    })


    it('should get all authorized to read todoLists, role == basic', async function() {
        this.test.user.role = 'basic'
        await helper.generateTodoList(this.test.user._id)
        await helper.generateTodoList(this.test.user._id)
        await helper.generateTodoList('unauthorized userId')

        const todoLists = await TodoListModel.getAllTodoLists()
        const authTodoLists = todoLists.authTodos(this.test.user, todoLists.todoLists)

        todoLists.todoLists.length.should.equal(3)
        authTodoLists.length.should.equal(2)
    })

    
    it('should get all authorized to read todoLists, role == admin', async function() {
        await helper.generateTodoList(this.test.user._id)
        await helper.generateTodoList(this.test.user._id)
        await helper.generateTodoList('unauthorized userId')

        const todoLists = await TodoListModel.getAllTodoLists()
        const authTodoLists = todoLists.authTodos(this.test.user, todoLists.todoLists)

        todoLists.todoLists.length.should.equal(3)
        authTodoLists.length.should.equal(3)
    })
    

    it('should get a todoList by id', async function() {
        const newTodoList = await helper.generateTodoList(this.test.user._id)

        const todoList = await TodoListModel.getTodoListById(newTodoList._id)

        todoList.todoList.should.eql(newTodoList)
        todoList.isOwner(this.test.user).should.equal(true)
    })


    it('should update todoList title by id', async function () {
        const newTodoList = await helper.generateTodoList(this.test.user._id)

        const title = 'New Todo List Title'
        const id = newTodoList._id

        const numUpdated = await TodoListModel.updateTodoListTitleById(id, title)
        numUpdated.should.equal(1)
    })


    it('should delete a todoList by id', async function () {
        const newTodoList = await helper.generateTodoList(this.test.user._id)

        const numRemoved = await TodoListModel.deleteTodoListById(newTodoList._id)

        numRemoved.should.equal(1)
    })


    it('should delete all TodoLists by user id', async function() {
        await helper.generateTodoList(this.test.user._id)
        await helper.generateTodoList(this.test.user._id)

        const numDeletedTodoLists = await TodoListModel.deleteAllTodoListsById(this.test.user._id)

        numDeletedTodoLists.should.equal(2)
    })
})



