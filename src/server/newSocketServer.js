/**
 * @Author: MocYang
 * @Email: 958292256@qq.com
 * @Date: 2021/8/3 13:50
 * @File: newSocketServer.js
 * @Description
 */
const WebSocket = require('ws')
const uuid = require('uuid')
const {pool} = require('../DB/connectionPool')
// const { connectionMap } = require('./connections')
const {serializer} = require('./util')
const {
  CODE_NEW_SOCKET_SERVER_SUCCESS,
  CODE_NEW_SOCKET_SERVER_FAIL
} = require('./code_config.js')

const Server = WebSocket.Server

/**
 * @description every time. root socket receive a msg. create a socket connection.
 * @param rootWs {WebSocket} root WebSocket instance. use for
 * @param config {Object}
 */
function newSocketServer(rootWs, config) {
  const {
    host,
    port,
    namespace,
    message = ''
  } = config
  // todo: verify host&port.
  const address = `ws://${host}:${port}`
  const newServerUUID = uuid.v1()
  // insert new server to mysql.
  const createdTime = new Date()
  const createdTimestamp = +createdTime


  if (Number(port) <= 1000 && Number(port) >= 65535) {
    rootWs.send(serializer({
      code: CODE_NEW_SOCKET_SERVER_FAIL,
      msg: `create websocket for ws://${host}:${port} is failed.`,
      error: `port ${port} is invalid.`
    }))
    return
  }

  // 查重
  pool.query(
    `select * from servers`,
    (err, results) => {
      if (err) {
        return
      }

      let isHostAndPortExist = false
      for (let server of results) {
        if (server.host === host && server.port === port) {
          isHostAndPortExist = true
          break
        }
      }

      if (isHostAndPortExist) {
        rootWs.send(serializer({
          code: CODE_NEW_SOCKET_SERVER_FAIL,
          msg: `create websocket for ws://${host}:${port} is failed.`,
          error: `address ${address} is already in use.`
        }))
        return
      }

      pool.query(
        `insert into servers (uuid,host,port,message,namespace,running,created_at,updated_at,created_at_timestamp,updated_at_timestamp) values (?,?,?,?,?,?,?,?,?,?);`,
        [newServerUUID, host, port, message, namespace, 0, createdTime, createdTime, createdTimestamp, createdTimestamp],
        (err, results) => {
          if (err) {
            console.log(err)
            rootWs.send(serializer({
              code: CODE_NEW_SOCKET_SERVER_FAIL,
              msg: 'new server create fail.',
              err: err
            }))
            return
          }
          console.log(results)
          rootWs.send(serializer({
            code: CODE_NEW_SOCKET_SERVER_SUCCESS,
            msg: 'new server create success.',
            data: null
          }))
        }
      )
    }
  )
}

module.exports = {
  newSocketServer
}
