/**
 * @Author: yangqixin
 * @TIME: 2021/8/8 23:12
 * @FILE: connectionPool.js
 * @Email: 958292256@qq.com
 */
const mysqlConfig = require('./config')
const mysql = require('mysql')
const pool = mysql.createPool(mysqlConfig.config)

module.exports = {
  pool
}
