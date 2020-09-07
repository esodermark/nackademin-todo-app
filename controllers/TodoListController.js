const TodoListModel = require('../models/TodoListModel')
const TodoModel = require('../models/TodoListModel')

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
    },
    updateTodoListTitleByIdCallback: async (req, res) => {
        try {
            const id = req.params.id
            const title = req.body.title ? req.body.title : ''

            const todoList = await TodoListModel.getTodoListById(id)
            if(todoList.isOwner(req.user)) {
                const numUpdated = await TodoListModel.updateTodoListTitleById(id, title)
                res.json(numUpdated).status(200)
            } else {
                res.sendStatus(401)
            }
        } catch(error) { 
            res.json('Todo could not be updated')
            console.log(error)
        }
    },
    deleteTodoListByIdCallback: async (req, res) => {
        try {
            const id = req.params.id

            const todo = await TodoListModel.getTodoListById(id)
            if(todo.isOwner(req.user)) {
                const deletedTodoList = await TodoListModel.deleteTodoListById(id)
                await deletedTodoList.deleteTodos(id)
                
                res.json(deletedTodoList.numRemoved).status(200)
            } else {
                res.sendStatus(401)
            }   
        } catch(error) { 
            res.json('Todo could not be deleted')
            console.log(error)
        }
    }
}