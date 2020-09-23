const GDPRController = require('../controllers/GDPRController')
const { Router } = require('express');
const auth = require('../middleware/auth')

const router = new Router()

router.get('/userDocumentation', auth.user, GDPRController.getUserDocumentation)

router.delete('/userDocumentation/:id', auth.user, GDPRController.deleteUserDocumentation)



module.exports = router;