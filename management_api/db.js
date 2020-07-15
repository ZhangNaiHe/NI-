const mysql = require('mysql')
const {db} = require('./config')
const connection = mysql.createConnection(db)
connection.connect()
module.exports = connection