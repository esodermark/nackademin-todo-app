const db = require('../database/dbConnection')
const permissions = require('../permissions/todoPermissions')

module.exports = { 
    postTodoList(body) {
        return new Promise((resolve, reject) => {
            db.todoLists.insert(body, function(err, newTodoList) {
                if (err) reject(err)
                resolve(newTodoList)
            })
        })
    },

    getTodoListById(id) {
        return new Promise((resolve, reject) => {
            db.todoLists.find({ _id: id }, function (err, todoList) {
                if (err) reject(err)
                resolve({
                    todoList: todoList[0],
                    isOwner(user) {
                       return permissions.isOwner(user, todoList[0])
                    },
                    getTodos(listId) {
                        return new Promise((resolve, reject) => {
                            db.todos.find({listId: listId}, function(err, todos) {
                                if (err) reject(err)
                                resolve(todos)
                            })
                        });
                    }
                })
            })
        });
    },

    clear() {
        db.todoLists.remove({}, {multi: true})
    }
}