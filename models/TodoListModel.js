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
    getAllTodoLists() {
        return new Promise((resolve, reject) => {
            db.todoLists.find({}, function(err, todoLists) {
                if (err) reject(err)
                resolve({
                    todoLists,
                    authTodos(user) {
                        return permissions.mapAuthorizedTodos(user, todoLists)
                    }
                })
            })
        });
    },
    getTodoListById(id) {
        return new Promise((resolve, reject) => {
            db.todoLists.find({ _id: id }, function (err, todoList) {
                if (err) reject(err)
                resolve({
                    todoList: todoList[0],
                    isOwner(user) {
                       return permissions.isOwner(user, todoList[0])
                    }
                })
            })
        });
    },
    updateTodoListTitleById(id, title) {
        return new Promise((resolve, reject) => {
            db.todoLists.update({ _id: id }, { $set: { title: title } }, {}, function (err, numUpdated) {
                if (err) reject(err)
                resolve(numUpdated)
            })
        })
    },
    deleteTodoListById(id) {
        return new Promise((resolve, reject)=>{
            db.todoLists.remove({ _id: id }, (err, numRemoved) => {
               if(err) reject (err)
               resolve(numRemoved)
            })
        })
    },

    clear() {
        db.todoLists.remove({}, { multi: true })
    }
}