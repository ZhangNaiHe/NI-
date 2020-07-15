const router = require('express').Router()
const roleCtrl = require('../controllers/roleCtrl')
const bodyParser = require('body-parser')

// 角色列表
router.get('/roles',roleCtrl.rolelist)

// 添加角色
router.post('/roles',bodyParser.json(),roleCtrl.roleadd)

// 根据 ID 查询角色
router.get('/roles/:id',roleCtrl.roleget)

// 编辑提交角色
router.put('/roles/:id',bodyParser.json(),roleCtrl.roleedit)

// 删除角色
router.delete('/roles/:id',roleCtrl.roledelete)

// 角色授权
router.post('/roles/:roleId/rights',bodyParser.json(),roleCtrl.roleright)

// 删除角色指定权限
router.delete('/roles/:roleId/rights/:rightId',roleCtrl.roledelright)
module.exports = router