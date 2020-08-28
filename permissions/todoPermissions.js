const ROLE = require('./Roles')

function canReadTodo(user, todo) {
    return (
        user.role === ROLE.ADMIN ||
        todo.ownerId === user._id
    )
}

function readAuthorizedTodos(user, todos) {
    if(user.role === ROLE.ADMIN) return todos
    return todos.filter(todo => todo.ownerId === user._id)
}

module.exports = {
    canReadTodo,
    readAuthorizedTodos
}