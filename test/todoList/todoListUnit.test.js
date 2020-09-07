const TodoListModel = require('../../models/TodoListModel')
const UserModel = require('../../models/UserModel')
const TodoModel = require('../../models/TodoModel')

require('chai').should();
require('dotenv').config()

const helper = require('./helper')


describe('todoList Unit Tests', () => {
    this.currentTest = {}

    beforeEach(async function() {
        TodoListModel.clear()
        TodoModel.clear()
        UserModel.clear()

        const user = await helper.generateTestUser()
        this.currentTest.user = user
    })


    it('should create a todoList', async function() {
        const newTodoList = await helper.generateTodoList(this.test.user._id)

        newTodoList.title.should.equal('Todo List Title')
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
})



