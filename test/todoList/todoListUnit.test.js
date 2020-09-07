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


    it('should get a todoList with associated todos by id', async function() {
        const newTodoList = await helper.generateTodoList(this.test.user._id)
        const newTodos = await helper.generateTodos(2, newTodoList._id, this.test.user._id)

        const todoList = await TodoListModel.getTodoListById(newTodoList._id)
        const todos = await todoList.getTodos(newTodoList._id)

        todoList.todoList.should.eql(newTodoList)
        todos.should.eql(newTodos)
        todoList.isOwner(this.test.user).should.equal(true)
    })


    it('should update todoList title by id', async function () {
        const newTodoList = await helper.generateTodoList(this.test.user._id)

        const title = 'New Todo List Title'
        const id = newTodoList._id

        const numUpdated = await TodoListModel.updateTodoListTitleById(id, title)
        numUpdated.should.equal(1)
    })


    it('should delete a todoList with associated todos by id', async function () {
        const newTodoList = await helper.generateTodoList(this.test.user._id)
        await helper.generateTodos(3, newTodoList._id)

        const deletedTodoList = await TodoListModel.deleteTodoListById(newTodoList._id)
        const numRemovedTodos = await deletedTodoList.deleteTodos(newTodoList._id)
        const deletedTodos = await helper.tryFetchDeletedTodos(newTodoList._id)

        deletedTodoList.numRemoved.should.equal(1)
        numRemovedTodos.should.equal(3)
        deletedTodos.length.should.equal(0)
    })
})



