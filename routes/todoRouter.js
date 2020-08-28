const TodoController = require('../controllers/TodoController')
const { Router } = require('express');
const auth = require('../middleware/auth')

const router = new Router()


router.get('/todo', auth.user, TodoController.getAllTodosCallback)

router.get('/todo/:id', auth.user, TodoController.getTodoByIdCallback)

router.post('/todo', auth.user, TodoController.postTodoCallback)

router.patch('/todo/:id', TodoController.updateTodoByIdCallback)

router.delete('/todo/:id', TodoController.deleteTodoByIdCallback)



module.exports = router;