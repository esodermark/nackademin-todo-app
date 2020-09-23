const TodoListModel = require('../models/TodoListModel')
const TodoModel = require('../models/TodoModel')
const UserModel = require('../models/UserModel')

module.exports = { 

    getUserDocumentationByIdCallback: async (req, res) => {
        try {
            const user = await UserModel.getUserInformationById(req.user._id)
            const todoLists = await TodoListModel.getAllTodoLists()
            const authTodoLists = await todoLists.authTodos(req.user)

            authTodoListsWithTodos = await mapTodosOntoTodoLists(authTodoLists)

            res.json({
                user,
                todoLists: authTodoListsWithTodos,
            })
        } catch(error) {
            res.json('Could not get User Documentation')
            console.log(error)
        }
    },
    deleteUserDocumentationByIdCallback: async (req, res) => {
        try {
            const numUserDeleted = await UserModel.deleteUserById(req.user._id)
            const numTodoListsDeleted = await TodoListModel.deleteAllTodoListsById(req.user._id)
            const numTodosDeleted = await TodoModel.deleteAllTodosById(req.user._id)

            res.json({
                numUserDeleted,
                numTodoListsDeleted,
                numTodosDeleted
            })
        } catch(error) {
            res.json('Could not delete all todo lists')
            console.log(error)
        }
    }
}

async function mapTodosOntoTodoLists(authTodoLists) {
    for(let i = 0; i < authTodoLists.length; i++) {
        const todos = await TodoModel.getTodosByTodoListId(authTodoLists[i]._id)
        authTodoLists[i].todos = todos
    }
    return authTodoLists
}