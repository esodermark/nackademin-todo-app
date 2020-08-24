var Datastore = require('nedb'), 

dbTodos = new Datastore({ filename: 'Todos' });

dbTodos.loadDatabase(function (err) {});

module.exports = dbTodos;