const TodoModel = require('../models/TodoModel')

module.exports = {
    
    getAllTodosCallback: async (req, res) => {
        try {
            // res
            const todos = await TodoModel.getAllTodos()
            res.json(todos)
        } catch(error) {
            res.json('Todos could not be generated')
            console.log(error)
        }
    },
    getTodoByIdCallback: async (req, res) => {
        try {
            // req
            const id = req.params.id
            // res
            const todo = await TodoModel.getTodoById(id)
            res.json(todo)
        } catch(error) {
            res.json('Something went wrong')
            console.log(error)
        }  
    },
    postTodoCallback: async (req, res) => {
        try {
            // req
            const body = {
                title: req.body.title ? req.body.title : '',
                done: req.body.done ? rereq.body.done : false
            }
            // res
            const newTodo = await TodoModel.postTodo(body)
            res.json(`Todo '${newTodo.title}' was created`)    
        } catch(error) { 
            res.json('Todo could not be created')
            console.log(error)
        }
    },
    updateTodoByIdCallback: async (req, res) => {
        try {
            // req
            const id = req.params.id
            const body = {
                title: req.body.title,
                done: req.body.done
            }
            // res
            const numUpdated = await TodoModel.updateTodoById(id, body)
            res.json(`${numUpdated} todo was updated`)    
        } catch(error) { 
            res.json('Todo could not be updated')
            console.log(error)
        }
    },
    deleteTodoByIdCallback: async (req, res) => {
        try {
            // req
            const id = req.params.id
            // res
            const numDeleted = await TodoModel.deleteTodoById(id)
            res.json(`${numDeleted} todo was deleted`)    
        } catch(error) { 
            res.json('Todo could not be deleted')
            console.log(error)
        }
    },
}