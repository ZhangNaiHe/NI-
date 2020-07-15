const db = require('../db')
// 获取权限列表
module.exports.rightlist = (req, res) => {
    if (req.params.type === 'list') {
        let sql = `SELECT *
        FROM rights`
        db.query(sql, (error, result) => {
            if (error) throw error
            res.json({
                "data": result,
                "meta": {
                    "msg": "获取权限列表成功",
                    "status": 200
                }
            })
        })
    } else if (req.params.type === 'tree') {
        let sql = `SELECT *
        FROM rights
        WHERE level = 0`
        db.query(sql, (error, result) => {
            if (error) throw error
            for (let i = 0; i < result.length; i++) {
                let sql = `SELECT *
                 FROM rights
                 WHERE pid = ?
                 AND level = 1`
                let data = [result[i].id]
                db.query(sql, data, (error, nResult) => {
                    if (error) throw error
                    result[i].children = nResult
                    for (let j = 0; j < nResult.length; j++) {
                        let sql = `SELECT *
                         FROM rights
                         WHERE pid = ?
                         AND level = 2`
                        let data = result[i].id+','+nResult[j].id
                        db.query(sql, data, (error, nNResult) => {
                            if (error) throw error
                            nResult[j].children = nNResult
                            if (i >= result.length -1) {
                                if (j >= nResult.length - 1) {
                                    res.json({
                                        "data": result,
                                        "meta": {
                                            "msg": "获取权限列表成功",
                                            "status": 200
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }

        })
    }
}

// 左侧菜单权限
module.exports.menulist = (req, res) => {
    let sql = `SELECT *
    FROM menus
    WHERE pid IS NULL`
    db.query(sql,(error,result) => {
        if(error) throw error
         for(let i = 0; i < result.length; i++) {
            let sql = `SELECT *
            FROM menus
            WHERE pid IS NOT NULL
            AND pid = ?`
            let data = result[i].id
            db.query(sql,data,(error,nResult) => {
                if(error) throw error
                 result[i].children = nResult
                 if (i >= result.length - 1) {
                     res.json({
                        "data": result,
                        "meta": {
                            "msg": "获取菜单列表成功",
                            "status": 200
                        }
                     })
                 }
            })
         }
    })
}