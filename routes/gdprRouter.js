const GDPRController = require('../controllers/GDPRController')
const { Router } = require('express');
const auth = require('../middleware/auth')

const router = new Router()

router.get('/userDocumentation', auth.user, GDPRController.getUserDocumentationByIdCallback)

router.delete('/userDocumentation/:id', auth.user, GDPRController.deleteUserDocumentationByIdCallback)



module.exports = router;