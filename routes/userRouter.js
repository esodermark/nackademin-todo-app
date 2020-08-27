const UserController = require('../controllers/UserController')
const { Router } = require('express');

const router = new Router()


router.post('/user', UserController.createUserCallback)

router.post('/login', UserController.loginUserCallback)


module.exports = router;