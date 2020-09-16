const mongoose = require('mongoose')
const permissions = require('../permissions/todoPermissions')
require('dotenv').config()

const todoSchema = new mongoose.Schema({
    title: String,
    done: Boolean,
    ownerId: String,
    listId: String,
    _id: String
})

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
       
        return new Promise((resolve, reject) => {
            db.todos.find({ listId: id }, function(err, todos) {
                if (err) reject(err)
                resolve(todos)
            })
        });
    },
    async postTodo(body) {
        const {title, done, ownerId, listId} = body
        const _id = mongoose.Types.ObjectId();
        const todo = await Todo.create({_id, title, done, ownerId, listId})
        return todo._doc
        return new Promise((resolve, reject) => {
            db.todos.insert(body, function(err, newDoc) {
                if (err) reject(err)
                resolve(newDoc)
            })
        })
    },
    updateTodoById(id, body) {
        return new Promise((resolve, reject) => {
            db.todos.update({ _id: id }, {title: body.title, done: body.done, ownerId: body.ownerId}, {}, function (err, numUpdated) {
                if (err) reject(err)
                resolve(numUpdated)
            })
        })
    },
    deleteTodoById(id) {
        return new Promise((resolve, reject)=>{
            db.todos.remove({ _id: id }, (err, numRemoved) => {
               if(err) reject (err)
               resolve(numRemoved)
            })
        })
    },
    deleteTodosByTodoListId(id) {
        return new Promise((resolve, reject)=>{
            db.todos.remove({ listId: id }, { multi: true }, (err, numRemoved) => {
               if(err) reject (err)
               resolve(numRemoved)
            })
        })
    },
    async clear() {
        return await Todo.deleteMany({})
    }
}