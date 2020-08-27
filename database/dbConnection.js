var Datastore = require('nedb'), 

db = {}
db.todos = new Datastore({ filename: __dirname + "/todos.db" });
db.users = new Datastore({ filename: __dirname + "/users.db" });

db.todos.loadDatabase();
db.users.loadDatabase();

module.exports = db