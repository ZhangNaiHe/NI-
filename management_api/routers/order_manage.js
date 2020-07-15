const router = require('express').Router()
const orderCtrl = require('../controllers/orderCtrl')
const bodyParser = require('body-parser')
// 订单数据列表
router.get('/orders',orderCtrl.orderlist)
// 发货
router.put('/orders/:id',bodyParser.json() ,orderCtrl.orderedit)
// 物流信息测试
router.get('/kuaidi/619915933338',orderCtrl.orderwuliu)
module.exports = router