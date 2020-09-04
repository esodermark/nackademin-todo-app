const TodoListModel = require('../models/TodoListModel')
const { getTodoListById } = require('../models/TodoListModel')

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
    },
    getTodoListByIdCallback: async (req, res) => {
        try {
            const id = req.params.id
           
            const todoList = await TodoListModel.getTodoListById(id)
            const todos = await todoList.getTodos(id)
            todoList.isOwner(req.user) 
            ? res.json({
                ...todoList,
                todos
            }).status(200) 
            : res.sendStatus(401)
        } catch(error) {
            res.json('Something went wrong')
            console.log(error)
        }  
    }
}