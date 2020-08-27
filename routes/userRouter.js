const UserController = require('../controllers/UserController')
const { Router } = require('express');

const router = new Router()


router.post('/user', UserController.createUserCallback)


module.exports = router;