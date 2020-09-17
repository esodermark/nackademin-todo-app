const mongoose = require('mongoose')
const permissions = require('../permissions/todoPermissions')
require('dotenv').config()

const todoListSchema = new mongoose.Schema({
    title: String,
    ownerId: String,
    _id: String
})

const TodoList = mongoose.model('TodoList', todoListSchema)

module.exports = { 
    async postTodoList(body) {
        const {title, ownerId} = body
        const _id = mongoose.Types.ObjectId();
        const todoList = await TodoList.create({_id, title, ownerId})
        return todoList._doc
    },
    async getAllTodoLists() {
        const todoLists = await TodoList.find().lean()
        return {
            todoLists: todoLists,
            authTodos(user) {
                return permissions.mapAuthorizedTodos(user, todoLists)
            }
        }
    },
    async getTodoListById(id) {
        const todoList = await TodoList.findById(id).lean()
        return {
            todoList: todoList,
            isOwner(user) {
                return permissions.isOwner(user, todoList)
            }
        }
    },
    async updateTodoListTitleById(id, title) {
       const updatedTodoList = await TodoList.updateOne( {_id: id}, {title: title} )

       return updatedTodoList.nModified
    },
    async deleteTodoListById(id) {
        const deletedTodoList = await TodoList.deleteOne( {_id: id} )

        return deletedTodoList.deletedCount
    },

    async clear() {
        return await TodoList.deleteMany({})
    }
}