const db = require('../db')
// 登录
module.exports.login = (req, res) => {
    let sql = `SELECT *
    FROM users
    WHERE username = ? AND password = ?`
    let data = [req.body.username,req.body.password]
    db.query(sql,data, (error, result) => {
        if(error) throw error
        if(result.length !== 0) {
            result[0].token= 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjowLCJpYXQiOjE1MTI1NDQyOTksImV4cCI6MTUxMjYzMDY5OX0.eGrsrvwHm-tPsO9r_pxHIQ5i5L1kX9RX444uwnRGaIM'
            res.json({
                "data":result[0],
                "meta": {
                    "msg": "登录成功",
                    "status": 200
                }
            })
        } else {
            res.json({
                "meta": {
                    "msg": "用户名或密码错误",
                    "status": 400
                }
            })
        }
    })
}