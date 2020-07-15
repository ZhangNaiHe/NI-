const db = require('../db')

// 订单数据列表
module.exports.orderlist = (req, res) => {
    let pagenum = parseInt(req.query.pagenum)
    let pagesize = parseInt(req.query.pagesize)
    db.query(`SELECT *
    FROM orders 
    WHERE order_number LIKE '%${req.query.query}%'
    LIMIT ${(pagenum - 1) * pagesize},${pagesize}`, (error, result) => {
        if (error) throw error
        db.query('SELECT * FROM orders', (error, nNResult) => {
            if (error) throw error
            res.json({
                "data": {
                    "totalpage": nNResult.length,
                    "pagenum": pagenum,
                    "goods": result
                },
                "meta": {
                    "msg": "获取成功",
                    "status": 200
                }
            })
        })

    })
}


// 发货
module.exports.orderedit = (req, res) => {
    let send
    if(req.body.is_send == 'true') {
        send = 'false'
    } else {
        send = 'true'
    }
    let sql = `UPDATE orders
    SET is_send = ?
    where order_id = ?`
    let data = [send,req.params.id]
    db.query(sql,data,(error,result) => {
        if(error) throw error
         res.json(result)
    })
}

// 物流
module.exports.orderwuliu = (req, res) => {
    res.json({
        "data": [
          {
            "time": "2018-05-10 09:39:00",
            "ftime": "2018-05-10 09:39:00",
            "context": "已签收,感谢使用顺丰,期待再次为您服务",
            "location": ""
          },
          {
            "time": "2018-05-10 08:23:00",
            "ftime": "2018-05-10 08:23:00",
            "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
            "location": ""
          },
          {
            "time": "2018-05-10 07:32:00",
            "ftime": "2018-05-10 07:32:00",
            "context": "快件到达 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-10 02:03:00",
            "ftime": "2018-05-10 02:03:00",
            "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-09 23:05:00",
            "ftime": "2018-05-09 23:05:00",
            "context": "快件到达 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 21:21:00",
            "ftime": "2018-05-09 21:21:00",
            "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 13:07:00",
            "ftime": "2018-05-09 13:07:00",
            "context": "顺丰速运 已收取快件",
            "location": ""
          },
          {
            "time": "2018-05-09 12:25:03",
            "ftime": "2018-05-09 12:25:03",
            "context": "卖家发货",
            "location": ""
          },
          {
            "time": "2018-05-09 12:22:24",
            "ftime": "2018-05-09 12:22:24",
            "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
            "location": ""
          },
          {
            "time": "2018-05-08 21:36:04",
            "ftime": "2018-05-08 21:36:04",
            "context": "商品已经下单",
            "location": ""
          }
        ],
        "meta": { "status": 200, "message": "获取物流信息成功！" }
      })
}