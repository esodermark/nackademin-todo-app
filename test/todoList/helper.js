const TodoListModel = require('../../models/TodoListModel')
const UserModel = require('../../models/UserModel')
const TodoModel = require('../../models/TodoModel')

async function generateTestUser() {
    const username = process.env['USER_TEST']
    const password = process.env['HASHEDPASSWORD_TEST']
    const role =  process.env['ROLE_TEST']

    const user = await UserModel.createUser(username, password, role)
    return user
}

async function generateTodoList(userId) {
    const newTodoList = {
        title: 'Todo List Title',
        ownerId: userId
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

module.exports = {
    generateTestUser,
    generateTodoList,
    generateTodos,
    tryFetchDeletedTodos
}