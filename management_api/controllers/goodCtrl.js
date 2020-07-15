const db = require('../db')

// 商品列表数据
module.exports.goodlist = (req, res) => {
    let pagenum = parseInt(req.query.pagenum)
    let pagesize = parseInt(req.query.pagesize)
    db.query(`SELECT *
    FROM goods 
    WHERE goods_name LIKE '%${req.query.query}%'
    LIMIT ${(pagenum - 1) * pagesize},${pagesize}`, (error, result) => {
        if (error) throw error
        db.query('SELECT * FROM goods', (error, nNResult) => {
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

// 添加商品
module.exports.goodadd = (req, res) => {
    let sql = `INSERT INTO goods
    (goods_name,goods_cat,goods_price,goods_number,goods_weight,goods_introduce,pics,attrs,add_time,upd_time,hot_mumber,is_promote)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    let goods_cat = req.body.goods_cat.split(',')
    goods_cat = Number(goods_cat[2])
    let add_time = Date.now()
    let goods_price = Number(req.body.goods_price)
    let goods_number = Number(req.body.goods_number)
    let goods_weight = Number(req.body.goods_weight)
    let attrs = String(req.body.attrs)
    let pics = String(req.body.pics)
    let data = [req.body.goods_name, goods_cat, goods_price, goods_number, goods_weight, req.body.goods_introduce, pics, attrs, add_time, add_time, 0, 'false']
    db.query(sql, data, (error, result) => {
        if (error) throw error
        if (result.affectedRows === 1) {
            let sql = `SELECT *
            FROM goods
            WHERE goods_id= ?`
            db.query(sql, result.insertId, (error, nNResult) => {
                if (error) throw error
                res.json({
                    "data": nNResult[0],
                    "meta": {
                        "msg": "创建商品成功",
                        "status": 201
                    }
                })
            })
        }
    })
}

// 根据 ID 查询商品
module.exports.goodgetid = (req, res) => {
    let sql = `SELECT *
    FROM goods
    WHERE goods_id = ?`
    let data = [req.params.id]
    db.query(sql, data, (error, result) => {
        if (error) throw error
        res.json({
            "data": result[0],
            "meta": {
                "msg": "获取成功",
                "status": 200
            }
        })
    })
}

// 编辑提交商品
module.exports.goodedit = (req, res) => {
    let sql = `UPDATE goods
    SET goods_name = ?,goods_price = ?,goods_number = ?,goods_weight = ?
    WHERE goods_id = ?`
    let data = [req.body.goods_name,req.body.goods_price,req.body.goods_number,req.body.goods_weight,req.params.id]
    db.query(sql,data,(error,result) => {
        if(error) throw error
         res.json({
             "meta":{
                 "msg": "更新成功",
                 "status": 200
             }
         })
    })
}

// 删除商品
module.exports.gooddelete = (req, res) => {
    let sql = `DELETE FROM goods
    WHERE goods_id = ?`
    let data = [req.params.id]
    db.query(sql,data,(error,result) => {
        if(error) throw error
         res.json({
             "data":null,
             "meta":{
                "msg": "删除成功",
                "status": 200
            }
         })
    })
}