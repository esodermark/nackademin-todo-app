const TodoController = require('../controllers/TodoController')
const {Router} = require('express');

const router = new Router()


router.get('/todo', TodoController.getAllTodosCallback)

router.get('/todo/:id', TodoController.getTodoByIdCallback)

router.post('/todo', TodoController.postTodoCallback)

router.patch('/todo/:id', TodoController.updateTodoByIdCallback)

router.delete('/todo/:id', TodoController.deleteTodoByIdCallback)


module.exports = router;