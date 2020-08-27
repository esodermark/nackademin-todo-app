const db = require('../database/dbConnection')

module.exports = {
    createUser(username, password, role) {
        return new Promise((resolve, reject) => {
            db.users.insert({
                username,
                password,
                role
            }, function(err, newUser) {
                if (err) reject(err)
                resolve(newUser)
            })
        })
    },
    loginUser(username) {
        return new Promise((resolve, reject) => {
            db.users.find({username: username}, function (err, user) {
                if (err) reject(err)
                resolve(user[0])
            })
        })
    }
}