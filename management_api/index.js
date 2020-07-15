const express = require('express');
const app = express();
const cors = require('cors');
// 使用cors包
app.use(cors());
const {server} = require('./config')

app.use(express.static('public'))
// 配置bodyparser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

// 测试
// app.get('/', (req, res) => {
//     res.send(`http://127.0.0.1:${server.port}${server.version}`)
// })

// 登录
app.use(server.version,require('./routers/login'))
// 用户管理
app.use(server.version,require('./routers/user_manage'))
// 权限管理
app.use(server.version,require('./routers/right_manage'))
// 角色管理
app.use(server.version,require('./routers/role_manage'))
// 商品分类管理
app.use(server.version,require('./routers/assortman'))
// 分类参数管理
app.use(server.version,require('./routers/attributes'))
// 商品管理
app.use(server.version,require('./routers/good_manage'))
// 上传图片
app.use(server.version,require('./routers/uploads'))
// 订单管理
app.use(server.version,require('./routers/order_manage'))
app.listen(server.port,server.ip, () => {
    console.log(`http://127.0.0.1:${server.port}服务器运行中......`)
})