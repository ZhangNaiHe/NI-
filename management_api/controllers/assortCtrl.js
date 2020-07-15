const db = require('../db')

module.exports.assortlist = (req, res) => {
    console
    let pagenum = parseInt(req.query.pagenum)
    let pagesize = parseInt(req.query.pagesize)
    if (req.query.type == 1) {
        let sql = `SELECT *
        FROM cats
        WHERE cat_level = 0
        AND cat_deleted = 'false'`
        db.query(sql, (error, result) => {
            if (error) throw error
            res.json({
                "data": {
                    "result": result,
                    "total": result.length
                },
                "meta": {
                    "msg": "获取一级分类成功",
                    "status": 200
                }
            })
        })
    } else if (req.query.type == 2) {
        let sql = `SELECT *
        FROM cats
        WHERE cat_level = 0
        AND cat_deleted = 'false'`
        db.query(sql, (error, result) => {
            if (error) throw error
            for (let i = 0; i < result.length; i++) {
                let sql = `SELECT *
                 FROM cats
                 WHERE cat_pid = ?
                 AND cat_deleted = 'false'
                 AND cat_level = 1`
                let data = [result[i].cat_id]
                db.query(sql, data, (error, nResult) => {
                    if (error) throw error
                    result[i].children = nResult
                    if (i >= result.length - 1) {
                        res.json({
                            "data": {
                                "result": result,
                                "total": result.length
                            },
                            "meta": {
                                "msg": "获取成功",
                                "status": 200
                            }
                        })
                    }
                })
            }
        })
    } else if (req.query.type==3) {
        let sql = `SELECT *
        FROM cats
        WHERE cat_level = 0
        AND cat_deleted = 'false'
        LIMIT ${(pagenum - 1) * pagesize},${pagesize}`
        db.query(sql, (error, result) => {
            if (error) throw error
            for (let i = 0; i < result.length; i++) {
                let sql = `SELECT *
                 FROM cats
                 WHERE cat_pid = ?
                 AND cat_deleted = 'false'
                 AND cat_level = 1`
                let data = [result[i].cat_id]
                db.query(sql, data, (error, nResult) => {
                    if (error) throw error
                    result[i].children = nResult
                    for (let j = 0; j < nResult.length; j++) {
                        let sql = `SELECT *
                         FROM cats
                         WHERE cat_pid = ?
                         AND cat_deleted = 'false'
                         AND cat_level = 2`
                        let data = [nResult[j].cat_id]
                        db.query(sql, data, (error, nNResult) => {
                            if (error) throw error
                            nResult[j].children = nNResult
                            if (i >= result.length - 1) {
                                if (j >= nResult.length - 1) {
                                    res.json({
                                        "data": {
                                            "result": result,
                                            "total": result.length
                                        },
                                        "meta": {
                                            "msg": "获取成功",
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
    } else {
        let sql = `SELECT *
        FROM cats
        WHERE cat_level = 0
        AND cat_deleted = 'false'`
        db.query(sql, (error, result) => {
            if (error) throw error
            for (let i = 0; i < result.length; i++) {
                let sql = `SELECT *
                 FROM cats
                 WHERE cat_pid = ?
                 AND cat_deleted = 'false'
                 AND cat_level = 1`
                let data = [result[i].cat_id]
                db.query(sql, data, (error, nResult) => {
                    if (error) throw error
                    result[i].children = nResult
                    for (let j = 0; j < nResult.length; j++) {
                        let sql = `SELECT *
                         FROM cats
                         WHERE cat_pid = ?
                         AND cat_deleted = 'false'
                         AND cat_level = 2`
                        let data = [nResult[j].cat_id]
                        db.query(sql, data, (error, nNResult) => {
                            if (error) throw error
                            nResult[j].children = nNResult
                            if (i >= result.length - 1) {
                                if (j >= nResult.length - 1) {
                                    res.json({
                                        "data": {
                                            "result": result,
                                            "total": result.length
                                        },
                                        "meta": {
                                            "msg": "获取成功",
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

// 添加分类
module.exports.assortadd = (req, res) => {
    let sql = `INSERT INTO cats
    (cat_pid,cat_name,cat_level,cat_deleted)
    VALUES (?,?,?,?)`
    let data = [req.body.cat_pid, req.body.cat_name, req.body.cat_level,'false']
    db.query(sql, data, (error, result) => {
        if (error) throw error
        if (result.affectedRows === 1) {
            let sql = `SELECT *
            FROM cats
            WHERE cat_id= ?`
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

// 根据 id 查询分类
module.exports.assortgetid = (req, res) => {
    let sql = `SELECT *
    FROM cats
    WHERE cat_id = ?`
    let data = [req.params.id]
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

// 编辑提交分类
module.exports.assortedit = (req, res) => {
    let sql = `UPDATE cats
    SET cat_name = ?
    WHERE cat_id = ?`
    let data = [req.body.cat_name, req.params.id]
    db.query(sql, data, (error, result) => {
        if (error) throw error
        if (result.affectedRows === 1) {
            let sql = `SELECT *
            FROM cats
            WHERE cat_id= ?`
            db.query(sql, req.params.id, (error, nNResult) => {
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

// 删除分类
module.exports.assortdelete = (req, res) => {
    let sql = `UPDATE cats
    SET cat_deleted = 'true'
    WHERE cat_id = ?`
    let data = [req.params.id]
    db.query(sql, data, (error, result) => {
        if (error) throw error
        if (result.affectedRows === 1) {
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