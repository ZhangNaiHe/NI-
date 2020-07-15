const db = require('../db')

// 参数列表
module.exports.attrlist = (req, res) => {
    let sql = `SELECT *
    FROM attrs
    WHERE cat_id = ?
    AND attr_sel = ?`
    let data = [req.params.id,req.query.sel]
    db.query(sql,data,(error,result) => {
        if(error) throw error
         res.json({
             "data": result,
             "meta": {
                 "msg": "获取成功",
                 "status": 200
             }
         })
    })
}

// 添加动态参数或者静态属性
module.exports.attradd = (req, res) => {
    let sql = `INSERT INTO attrs
    (attr_name,cat_id,attr_sel,attr_write,attr_vals)
    VALUES (?,?,?,?,?)`
    let attr_write
    if (req.body.attr_sel == 'many') {
        attr_write = 'list'
    } else {
        attr_write = 'manual'
    }
    let data = [req.body.attr_name,req.params.id,req.body.attr_sel,attr_write,req.body.attr_vals]
    db.query(sql,data,(error,result) => {
        if(error) throw error
        if (result.affectedRows === 1) {
            let sql = `SELECT *
            FROM attrs
            WHERE attr_id= ?`
            db.query(sql, result.insertId, (error, nNResult) => {
                if (error) throw error
                res.json({
                    "data": nNResult[0],
                    "meta": {
                        "msg": "创建成功",
                        "status": 201
                    }
                })
            })
        }
    })
}

// 删除参数
module.exports.attrdelete = (req, res) => {
    let sql = `DELETE FROM attrs
    WHERE cat_id = ?
    AND attr_id = ?`
    let data = [req.params.id,req.params.attrid]
    db.query(sql,data,(error,result) => {
        if(error) throw error
        if(result.affectedRows === 1) {
            res.json({
                "data": null,
                "meta": {
                    "msg": "删除成功",
                    "status": 200
                }
            })
        }
    })
}

// 根据 ID 查询参数
module.exports.attrgetid = (req, res) => {
    console.log(req.query)
    let sql = `SELECT *
    FROM attrs
    WHERE cat_id = ?
    AND attr_id = ?
    AND attr_sel = ?`
    let data = [req.params.id,req.params.attrId,req.query.attr_sel]
    db.query(sql, data, (error, result) => {
        if (error) throw error
        res.json({
            "data": result,
            "meta": {
                "msg": "获取成功",
                "status": 200
            }
        })
    })
}

// 编辑提交参数
module.exports.attredit = (req, res) => {
    let sql = `UPDATE attrs
    SET attr_name = ?,attr_sel = ?,attr_vals = ?
    WHERE cat_id = ?
    AND attr_id = ?`
    let data = [req.body.attr_name,req.body.attr_sel,req.body.attr_vals,req.params.id,req.params.attrId]
    db.query(sql,data,(error,result) => {
        if(error) throw error
        if (result.affectedRows === 1) {
            let sql = `SELECT *
            FROM attrs
            WHERE cat_id= ?
            AND attr_id = ?`
            db.query(sql,[req.params.id,req.params.attrId], (error, nNResult) => {
                if (error) throw error
                res.json({
                    "data": nNResult[0],
                    "meta": {
                        "msg": "更新成功",
                        "status": 200
                    }
                })
            })
        }
    })
}