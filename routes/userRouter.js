const UserController = require('../controllers/UserController')
const { Router } = require('express');
const auth = require('../middleware/auth')

const router = new Router()


router.post('/user', auth.user, UserController.createUserCallback)

router.post('/login', UserController.loginUserCallback)


module.exports = router;