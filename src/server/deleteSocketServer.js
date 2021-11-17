/**
 * @Author: yangqixin
 * @TIME: 2021/9/12 15:08
 * @FILE: deleteSocketServer.js
 * @Email: 958292256@qq.com
 * @Description: delete a socket server.
 */
const { serializer } = require('./util')
const { connectionMap } = require('./connections')
const { pool } = require('../DB/connectionPool')
const { stopSocketServer } = require('./stopSocketServer')

const {
  CODE_DELETE_SOCKET_SERVER_FAIL,
  CODE_DELETE_SOCKET_SERVER_SUCCESS
} = require('./code_config')

function deleteSocketServer(rootWs, config) {
  const { uuid, host, port } = config
  const existServer = connectionMap.get(uuid)

  if (existServer) {
    try {
      stopSocketServer(rootWs, config)
    } catch (e) {

    }
  }

  pool.query(
    `delete from servers where uuid=(?)`,
    [uuid],
    (err) => {
      if (err) {
        rootWs.send(serializer({
          code: CODE_DELETE_SOCKET_SERVER_FAIL,
          msg: 'delete server fail.',
          error: err
        }))

        connectionMap.delete(uuid)

        rootWs.send(serializer({
          code: CODE_DELETE_SOCKET_SERVER_SUCCESS,
          msg: 'delete server success.',
          data: { uuid }
        }))
      }
    }
  )
}

module.exports = {
  deleteSocketServer
}
