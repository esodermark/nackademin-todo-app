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
        db.todos = new Datastore({ filename: __dirname + "/test_todos.db", autoload: true });
        db.users = new Datastore({ filename: __dirname + "/test_users.db", autoload: true });
        db.todoLists = new Datastore({ filename: __dirname + "/test_todoLists.db", autoload: true });

        // db.todos.loadDatabase();
        // db.users.loadDatabase();
        // db.todoLists.loadDatabase();
        break
}


module.exports = db