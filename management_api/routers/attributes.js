const router = require('express').Router()
const attrCtrl = require('../controllers/attrCtrl')
const bodyParser = require('body-parser')

// 参数列表
router.get('/categories/:id/attributes',bodyParser.json(),attrCtrl.attrlist)
// 添加动态参数或者静态属性
router.post('/categories/:id/attributes',bodyParser.json(),attrCtrl.attradd)
// 删除参数
router.delete('/categories/:id/attributes/:attrid',attrCtrl.attrdelete)
// 根据 ID 查询参数
router.get('/categories/:id/attributes/:attrId',bodyParser.json(),attrCtrl.attrgetid)
// 编辑提交参数
router.put('/categories/:id/attributes/:attrId',bodyParser.json(),attrCtrl.attredit)
module.exports = router