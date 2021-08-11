/**
 * @Author: yangqixin
 * @TIME: 2021/8/8 23:11
 * @FILE: config.js
 * @Email: 958292256@qq.com
 */
require('dotenv').config()
const config = {
  connectionLimit: 10,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE
  // socketPath: '/tmp/mysql.sock'
}
module.exports = {
  config
}
