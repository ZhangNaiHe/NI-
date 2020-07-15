const db = require('../db')

// 用户数据列表
module.exports.userList = (req, res) => {
    let pagenum = parseInt(req.query.pagenum)
    let pagesize = parseInt(req.query.pagesize)
    db.query(`SELECT *
    FROM users 
    WHERE is_delete = 0 AND username LIKE '%${req.query.query}%'
    LIMIT ${(pagenum-1) * pagesize},${pagesize}`,(error, result) => {
        if(error) throw error
        result.forEach(function(val,index,result) {
                db.query(`SELECT roleName FROM roles WHERE roleID = ${result[index].rid}`,(error, nResult) => {
                    if(error) throw error
                    result[index].role_name = nResult[0].roleName
                    db.query('SELECT * FROM users',(error,nNResult) => {
                        if(error) throw error
                        if(index >= result.length -1) {
                            res.json({
                                "data": {
                                    "totalpage": nNResult.length,
                                    "pagenum": pagenum,
                                    "users": result
                                },
                                "meta": {
                                    "msg": "获取成功",
                                    "status": 200
                                }
                            })
                        }
                        
                    })
                })
        })
        
        
    })
}

// 添加用户
module.exports.useradd = (req, res) => {
    let sql = `SELECT *
    FROM users
    WHERE username = ?`
    let data = [req.body.username]
    db.query(sql,data,(error, result) => {
        if(error) throw error
        if(result.length !== 0) {
            res.json({
                "meta": {
                    "msg": "用户名已存在"
                }
            })
        }else {
            let sql = `INSERT INTO users (username,password,email,mobile,type,create_time,is_delete,rid)
            VALUES (?,?,?,?,?,?,?,?)`;
            let type = 'true'
            let create_time = new Date()
            let is_delete = 0
            let data = [req.body.username,req.body.password,req.body.email,req.body.mobile,type,create_time,is_delete,1]
            db.query(sql,data,(error, nResult) => {
                if(error) throw error
                if(nResult.affectedRows===1) {
                    let sql = `SELECT * 
                    FROM users
                    WHERE id = ?`
                    db.query(sql,nResult.insertId,(error,nNResult) => {
                        if(error) throw error
                        res.json({
                            "data": nNResult[0],
                            "meta": {
                                "msg": "用户创建成功",
                                "status": 201
                            }
                        })
                    })
                    
                }
                
            })
        }
    })
}

// 修改用户状态
module.exports.usertype = (req,res) => {
    let sql = `UPDATE users
    SET type = ?
    WHERE id = ?`
    let data = [req.params.type,req.params.uId]
    db.query(sql,data,(error,result) => {
        if(error) throw error
        if(result.affectedRows === 1) {
            let sql = `SELECT * 
            FROM users
            WHERE id = ?`
            let data = [req.params.uId]
            db.query(sql,data,(error,nResult) => {
                if(error) throw error
                res.json({
                    "data": nResult[0],
                    "meta": {
                        "msg": "设置状态成功",
                        "status": 200
                    }
                })
            })
        }
    })
}

// 根据id查询用户信息
module.exports.usergetid = (req, res) => {
    let sql = `SELECT *
    FROM users
    WHERE id = ?`
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

// 编辑用户提交
module.exports.useredit = (req, res) => {
    let sql = `UPDATE users
    SET email = ?,mobile = ?
    WHERE id = ?`
    let data = [req.body.email,req.body.mobile,req.params.id]
    db.query(sql,data,(error,result) => {
        if(error) throw error
        if(result.affectedRows === 1) {
            let sql = `SELECT * 
            FROM users
            WHERE id = ?`
            let data = [req.params.id]
            db.query(sql,data,(error,nResult) => {
                if(error) throw error
                res.json({
                    "data": nResult[0],
                    "meta": {
                        "msg": "更新成功",
                        "status": 200
                    }
                })
            })
        }
    })
}

// 删除单个用户
module.exports.userdelete = (req,res) => {
    let sql = `DELETE FROM users
    WHERE id = ?`
    let data = [req.params.id]
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

// 分配用户角色
module.exports.userrole = (req, res) => {
    let sql =`UPDATE users
    SET rid = ?
    WHERE id = ?`
    let data = [req.body.rid,req.params.id]
    db.query(sql,data,(error,result) => {
        if(error) throw error
        if(result.affectedRows === 1) {
            let sql = `SELECT * 
            FROM users
            WHERE id = ?`
            let data = [req.params.id]
            db.query(sql,data,(error,nResult) => {
                if(error) throw error
                res.json({
                    "data": nResult[0],
                    "meta": {
                        "msg": "设置角色成功",
                        "status": 200
                    }
                })
            })
        }
    })
}