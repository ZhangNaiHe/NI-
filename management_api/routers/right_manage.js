const router = require('express').Router()
const rightCtrl = require('../controllers/rightCtrl')
// 所有权限列表
router.get('/rights/:type',rightCtrl.rightlist)
// 左侧菜单权限
router.get('/menus',rightCtrl.menulist)
module.exports = router