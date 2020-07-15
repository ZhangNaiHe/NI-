const router = require('express').Router()
const loginCtrl = require('../controllers/loginCtrl')
const bodyParser = require('body-parser')

router.post('/login',bodyParser.json(),loginCtrl.login)

module.exports = router