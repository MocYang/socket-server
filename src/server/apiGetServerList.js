/**
 * @Author: yangqixin
 * @TIME: 2021/8/11 23:26
 * @FILE: apiGetServerList.js
 * @Email: 958292256@qq.com
 */
const { serializer } = require('./util')
const { pool } = require('../DB/connectionPool')
const {
  CODE_GET_SERVER_LIST_FAIL,
  CODE_GET_SERVER_LIST_SUCCESS
} = require('./code_config')

const apiGetServerList = (rootWs) => {
  pool.query(
    `select * from servers;`,
    (err, results) => {
      if (err) {
        console.log('error: ', err)
        rootWs.send(serializer({
          code: CODE_GET_SERVER_LIST_FAIL,
          error: err,
          msg: 'Could not get data from database. see error for details.'
        }))
        return
      }
      rootWs.send(serializer({
        code: CODE_GET_SERVER_LIST_SUCCESS,
        data: results.map(rowPackage => ({...rowPackage})),
        msg: 'success'
      }))
    }
  )
}

module.exports = {
  apiGetServerList
}
