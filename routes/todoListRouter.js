const TodoListController = require('../controllers/TodoListController')
const { Router } = require('express');
const auth = require('../middleware/auth')

const router = new Router()


// router.get('/todoList/:id', auth.user, TodoListController.getTodoListByIdCallback)

router.post('/todoList', auth.user, TodoListController.postTodoListCallback)

// router.patch('/todoList/:id', auth.user, TodoListController.updateTodoListTitleByIdCallback)

// router.delete('/todoList/:id', auth.user, TodoListController.deleteTodoListByIdCallback)



module.exports = router;