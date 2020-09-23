const mongoose = require('mongoose')
const permissions = require('../permissions/todoPermissions')
require('dotenv').config()

const todoSchema = new mongoose.Schema({
    title: String,
    done: String,
    ownerId: String,
    listId: String,
    _id: String
}, { versionKey: false })

const Todo = mongoose.model('Todo', todoSchema)

module.exports = {
    async getAllTodos() {
        const todos = await Todo.find()
        return {
            ...todos,
            authTodos(user) {
                return permissions.mapAuthorizedTodos(user, todos)
            }
        }
    },

    async getTodoById(id) {
        const todo = await Todo.findById(id).lean()
        return {
            ...todo,
            isOwner(user) {
                return permissions.isOwner(user, todo)
            }
        }
    },

    async getTodosByTodoListId(id) {
        const todos = await Todo.find({ listId: id }).lean()
        return todos
    },

    async postTodo(body) {
        const {title, done, ownerId, listId} = body
        const _id = mongoose.Types.ObjectId();
        const todo = await Todo.create({_id, title, done, ownerId, listId})
        return todo._doc
    },

    async updateTodoById(id, body) {
        const {title, done, ownerId} = body
        const updatedTodo = await Todo.updateOne( {_id: id}, {title, done, ownerId} )
        return updatedTodo.nModified
    },

    async deleteTodoById(id) {
        const deletedTodo = await Todo.deleteOne( {_id: id} )

        return deletedTodo.deletedCount
    },
    
    async deleteTodosByTodoListId(id) {
        const deletedTodo = await Todo.deleteMany( {listId: id} )

        return deletedTodo.deletedCount
    },
    async clear() {
        return await Todo.deleteMany({})
    }
}