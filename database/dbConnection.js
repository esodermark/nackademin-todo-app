var Datastore = require('nedb')
require('dotenv').config()

db = {}
switch (process.env.ENVIRONMENT) {
    case 'development':
        db.todos = new Datastore({ filename: __dirname + "/todos.db" });
        db.users = new Datastore({ filename: __dirname + "/users.db" });
        db.todoLists = new Datastore({ filename: __dirname + "/todoLists.db" });

        db.todos.loadDatabase();
        db.users.loadDatabase();
        db.todoLists.loadDatabase();
        break
    case 'test':
        db.todoLists = new Datastore({ filename: __dirname + "/test_todoLists.db" });

        db.test_todoLists.loadDatabase();
        break
}


module.exports = db