const router = require('express').Router()
const bodyParser = require('body-parser')
const assortCtrl = require('../controllers/assortCtrl')
// 商品分类数据列表
router.get('/categories',bodyParser.json(),assortCtrl.assortlist)
// 添加分类
router.post('/categories',bodyParser.json(),assortCtrl.assortadd)
// 根据 id 查询分类
router.get('/categories/:id',assortCtrl.assortgetid)
// 编辑提交分类
router.put('/categories/:id',bodyParser.json(),assortCtrl.assortedit)
// 删除分类
router.delete('/categories/:id',assortCtrl.assortdelete)
module.exports = router