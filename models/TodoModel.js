const db = require('../database/dbConnection')

module.exports = {
    getAllTodos() {
        return new Promise((resolve, reject) => {
            db.todos.find({}, function(err, todos) {
                if (err) reject(err)
                resolve(todos)
            })
        });
    },
    getTodoById(id) {
        return new Promise((resolve, reject) => {
            db.todos.find({ _id: id }, function (err, todo) {
                if (err) reject(err)
                resolve(todo)
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
            db.todos.update({ _id: id }, {title: body.title, done: body.done}, {}, function (err, numUpdated) {
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
}