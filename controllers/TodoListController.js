const TodoListModel = require('../models/TodoListModel')

module.exports = {
    postTodoListCallback: async (req, res) => {
        try {
            const body = {
                title: req.body.title ? req.body.title : '',
                ownerId: req.user._id,
            }
            const todoList = await TodoListModel.postTodoList(body)
            res.json(todoList)  
        } catch(error) {
            res.json('TodoList could not be created')
            console.log(error)
        }
    }
}