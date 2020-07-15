module.exports = {
    server:{
        port:'7979',
        ip:'0.0.0.0',
        version:'/api/v1'
    },
    md5:{
        mkey:'asdfghjklzxcvbnm1234567890qwertyuiop',
        time:'2h'
    },
    db:{
        host:'127.0.0.1',
        port:'3306',
        user:'root',
        password:'123456',
        database:'management',
        multipleStatements: true //运行多条语句查询
    }
}