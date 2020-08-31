const ROLE = require('./Roles')

function isOwner(user, todo) {
    return (
        user.role === ROLE.ADMIN ||
        todo.ownerId === user._id
    )
}

function readAuthorizedTodos(user, todos) {
    if(user.role === ROLE.ADMIN) return todos
    return todos.filter(todo => todo.ownerId === user._id)
}

function canCreateUser(user) {
    return user.role === ROLE.ADMIN
}

module.exports = {
    isOwner,
    readAuthorizedTodos,
    canCreateUser
}