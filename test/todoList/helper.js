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
            _id: Math.random().toString(36).substring(7)
        }
        await TodoModel.postTodo(todos[i])
    }
    return todos
}

module.exports = {
    generateTestUser,
    generateTodoList,
    generateTodos
}