const auth = require('../middleware/auth')
const TodoListModel = require('../models/TodoListModel')
const UserModel = require('../models/UserModel')

module.exports = { 

    getUserDocumentationCallback: async (req, res) => {
        try {
            const user = await UserModel.getUserInformationById(req.user._id)
            const todoLists = await TodoListModel.getAllTodoLists()
            const authTodoLists = await todoLists.authTodos(req.user)
            
            authTodoListsWithTodos = await mapTodosOntoTodoLists(authTodoLists)

            res.json({
                user,
                authTodoListsWithTodos,
            })
        } catch(error) {
            res.json('Could not get User Documentation')
            console.log(error)
        }
    }
}