const db = require('../db')

// 角色列表
module.exports.rolelist = (req, res) => {
    let sql = `SELECT *
    FROM roles`
    db.query(sql, (error, result) => {
        if (error) throw error
        result.forEach(function (val, i, result) {
                db.query(`SELECT *
                    FROM rights
                    WHERE id IN (${result[i].rids})`, (error, nResult) => {
                    if (error) throw error
                    let arr = nResult.filter(item => item.level === 0)
                    arr.forEach(function (val, j, arr) {
                        let narr = nResult.filter(item => item.level === 1 && item.pid == arr[j].id)
                        arr[j].children = narr
                        narr.forEach(function (val, k, narr) {
                            if (narr[k]) {
                                let nNarr = nResult.filter(item => item.level === 2 && item.pid == arr[j].id + ',' + narr[k].id)
                                narr[k].children = nNarr
                                result[i].children = arr
                                if (k >= narr.length - 1 && i >= result.length - 1 && j >= arr.length - 1) {
                                    res.json({
                                        "data": result,
                                        "meta": {
                                            "msg": "获取成功",
                                            "status": 200
                                        }
                                    })
                                }
                            }
                        })
                    });
                })
        })
    })
}

// 添加角色

module.exports.roleadd = (req, res) => {
    let sql = `INSERT INTO roles
    (roleName,roleDesc,rids)
    VALUES (?,?,?)`
    let data = [req.body.roleName, req.body.roleDesc,'1,4,5']
    db.query(sql, data, (error, result) => {
        if (error) throw error
        if (result.affectedRows === 1) {
            let sql = `SELECT *
            FROM roles
            WHERE roleId = ?`
            db.query(sql, result.insertId, (error, nResult) => {
                if (error) throw error
                res.json({
                    "data": nResult[0],
                    "meta": {
                        "msg": "创建成功",
                        "status": 201
                    }
                })
            })
        }
    })
}

// 根据 ID 查询角色
module.exports.roleget = (req, res) => {
    let sql = `SELECT *
    FROM roles
    WHERE roleId = ?`
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

// 编辑提交角色
module.exports.roleedit = (req, res) => {
    let sql = `UPDATE roles
    SET roleName = ?,roleDesc = ?
    WHERE roleId = ?`
    let data = [req.body.roleName, req.body.roleDesc, req.params.id]
    db.query(sql, data, (error, result) => {
        if (error) throw error
        if (result.affectedRows === 1) {
            let sql = `SELECT *
            FROM roles
            WHERE roleId = ?`
            db.query(sql, [req.params.id], (error, nResult) => {
                if (error) throw error
                res.json({
                    "data": nResult[0],
                    "meta": {
                        "msg": "获取成功",
                        "status": 200
                    }
                })
            })
        }
    })
}

// 删除角色
module.exports.roledelete = (req, res) => {
    let sql = `DELETE FROM roles
    WHERE roleId = ?`
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

// 角色授权
module.exports.roleright = (req, res) => {
    let data = String(req.body.rids)
    db.query(`UPDATE roles
    SET rids = ?
    WHERE roleId = ${req.params.roleId}`, data, (error, result) => {
        if (error) throw error
        res.json({
            "data": null,
            "meta": {
                "msg": "更新成功",
                "status": 200
            }
        })
    })
}

// 删除角色指定权限
module.exports.roledelright = (req, res) => {
    let sql = `SELECT rids
    FROM roles
    WHERE roleId = ?`
    let data = [req.params.roleId]
    db.query(sql, data, (error, result) => {
        if (error) throw error
        let rids = result[0].rids.split(',')
        let rights= req.params.rightId.split(',')
        rights.forEach(function(val,index,rights) {
            rids = rids.filter(item => item != rights[index])
            if(index >= rights.length - 1) {
                let sql = `UPDATE roles
                SET rids = ?
                WHERE roleId = ?`
                rids = rids.join(',')
                let data = [rids,req.params.roleId]

                db.query(sql, data, (error, result) => {
                    if (error) throw error
                    rids = rids.split(',')
                    db.query(`SELECT *
                    FROM rights
                    WHERE id IN (${rids})`, (error, nResult) => {
                    if (error) throw error
                    let arr = nResult.filter(item => item.level === 0)
                    arr.forEach(function (val, j, arr) {
                        let narr = nResult.filter(item => item.level === 1 && item.pid == arr[j].id)
                        arr[j].children = narr
                        narr.forEach(function (val, k, narr) {
                            if (narr[k]) {
                                let nNarr = nResult.filter(item => item.level === 2 && item.pid == arr[j].id + ',' + narr[k].id)
                                narr[k].children = nNarr
                                if (k >= narr.length - 1 && j >= arr.length - 1) {
                                    res.json({
                                        "data": arr,
                                        "meta": {
                                            "msg": "获取成功",
                                            "status": 200
                                        }
                                    })
                                }
                            }
                        })
                    });
                })
                })
            }
        })
        

    })

}