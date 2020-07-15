const router = require('express').Router()
const goodCtrl = require('../controllers/goodCtrl')
const bodyParser = require('body-parser')

// 商品列表数据
router.get('/goods',goodCtrl.goodlist)
// 添加商品
router.post('/goods',bodyParser.json(),goodCtrl.goodadd)
// 根据 ID 查询商品
router.get('/goods/:id',goodCtrl.goodgetid)
// 编辑提交商品
router.put('/goods/:id',bodyParser.json(),goodCtrl.goodedit)
// 删除商品
router.delete('/goods/:id',goodCtrl.gooddelete)
module.exports = router