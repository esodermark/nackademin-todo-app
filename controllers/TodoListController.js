const TodoListModel = require('../models/TodoListModel')
const TodoModel = require('../models/TodoModel')

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
    getAllTodoListsCallback: async(req, res) => {
        try {
            const todoLists = await TodoListModel.getAllTodoLists()
            const authTodoLists = await todoLists.authTodos(req.user)

            for(let i = 0; i < authTodoLists.length; i++) {
                const todos = await TodoModel.getTodosByTodoListId(authTodoLists[i]._id)
                authTodoLists[i].todos = todos
            }

            res.json(authTodoLists)
        } catch(error) {
            res.json('Todos could not be generated')
            console.log(error)
        }
    },
    getTodoListByIdCallback: async (req, res) => {
        try {
            const id = req.params.id
           
            const todoList = await TodoListModel.getTodoListById(id)
            const todos = await TodoModel.getTodosByTodoListId(id)
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
                const numTodoListsRemoved = await TodoListModel.deleteTodoListById(id)
                const numTodosRemoved = await TodoModel.deleteTodosByTodoListId(id)
                
                res.json({numTodoListsRemoved, numTodosRemoved}).status(200)
            } else {
                res.sendStatus(401)
            }   
        } catch(error) { 
            res.json(1)
            console.log(error)
        }
    }
}