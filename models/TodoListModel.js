const db = require('../database/dbConnection')

module.exports = { 
    postTodoList(body) {
        return new Promise((resolve, reject) => {
            db.todoLists.insert(body, function(err, newTodoList) {
                if (err) reject(err)
                resolve(newTodoList)
            })
        })
    },

    clear() {
        db.todoLists.remove({}, {multi: true})
    }
}