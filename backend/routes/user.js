const express = require('express')
const router = express.Router()
const usersCtrl = require('../controllers/user')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.post('/signup', usersCtrl.signup)

router.post('/login', usersCtrl.login)
router.get('/accounts', auth.checkToken, usersCtrl.getAllUsers)
router.get('/accounts/:id', auth.checkToken, usersCtrl.getOneUser)

router.put('/accounts/:id', auth.checkToken, multer, usersCtrl.updateUser)

router.delete('/account/:id', auth.checkToken, usersCtrl.deleteUserAccount)

module.exports = router
