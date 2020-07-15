const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const bodyParser = require('body-parser')
// 用户数据列表
router.get('/users',userCtrl.userList)
// 添加用户
router.post('/users',bodyParser.json(),userCtrl.useradd)
// 修改用户状态
router.put('/users/:uId/state/:type',userCtrl.usertype)
// 根据 ID 查询用户信息
router.get('/users/:id',userCtrl.usergetid)
// 编辑用户提交
router.put('/users/:id',bodyParser.json(),userCtrl.useredit)
// 删除单个用户
router.delete('/users/:id',userCtrl.userdelete)
// 分配用户角色
router.put('/users/:id/role',bodyParser.json(),userCtrl.userrole)
module.exports = router