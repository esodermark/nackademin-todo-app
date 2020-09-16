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
            ...todos._doc,
            authTodos(user) {
                return permissions.mapAuthorizedTodos(user, todos)
            }
        }
    },
    async getTodoById(id) {
        const todo = await Todo.findById(id)
        return {
            ...todo._doc,
            isOwner(user) {
                return permissions.isOwner(user, todo[0])
            }
        }
    },
    getTodosByTodoListId(id) {
        return new Promise((resolve, reject) => {
            db.todos.find({ listId: id }, function(err, todos) {
                if (err) reject(err)
                resolve(todos)
            })
        });
    },
    postTodo(body) {
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
    clear() {
        db.todos.remove({}, {multi: true})
    }
}