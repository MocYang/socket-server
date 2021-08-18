/**
 * @Author: MocYang
 * @Email: 958292256@qq.com
 * @Date: 2021/8/3 13:50
 * @File: newSocketServer.js
 * @Description
 */
const WebSocket = require('ws')
const uuid = require('uuid')
const { pool } = require('../DB/connectionPool')
const { connectionMap } = require('./connections')
const { serializer, parseSocketMsg } = require('./util')
const {
  CODE_ESTABLISHED,
  CODE_NEW_SOCKET_SERVER_SUCCESS,
  CODE_NEW_SOCKET_SERVER_FAIL,
  CODE_UNEXPECTED_ERROR,
  CODE_MISSING_UUID,
  CODE_INVALID_UUID,
  CODE_ADMIN_CLIENT_PUSH_MESSAGE,
  CODE_SERVER_RECEIVE_ADMIN_MESSAGE
} = require('./code_config.js')

const Server = WebSocket.Server

/**
 * @description every time. root socket receive a msg. create a socket connection.
 * @param rootWs {WebSocket} root WebSocket instance. use for
 * @param config {Object}
 */
function newSocketServer(rootWs, config) {
  const { host, port, namespace } = config
  // todo: verify host&port.
  const address = `ws://${host}:${port}`
  const newServerUUID = uuid.v1()
  try {
    console.log(`new webSocket address: ${address}`)
    const wss = new Server({
      // host,
      port,
      clientTracking: true,
      perMessageDeflate: false
    })

    wss.on('connection', (ws, req) => {
      console.log(`new websocket server:${address} is created and ready for communicate.`)
      console.log('new server uuid is:', newServerUUID)

      ws.on('open', () => {
        console.log('WebSocket: ', address, 'is now connected.')

        // ws.send(serializer({
        //   code: CODE_OPEN,
        //   msg: `WebSocket is connected.`,
        //   data: ''
        // }))
      })

      ws.on('message', (msgBuffer) => {
        // TODO: handle sub socket message event.
        const msgObj = parseSocketMsg(msgBuffer)
        const { uuid, message, code } = msgObj

        if (!uuid) {
          ws.send(serializer({
            code: CODE_MISSING_UUID,
            msg: 'missing uuid..',
            error: 1
          }))
          return
        }

        const wssConfig = connectionMap.get(uuid)

        if (!wssConfig) {
          ws.send(serializer({
            code: CODE_INVALID_UUID,
            msg: 'cannot found a socket server for uuid:' + uuid,
            error: 1
          }))
          return
        }

        // admin socket server - send message
        if (code === CODE_ADMIN_CLIENT_PUSH_MESSAGE) {
          ws.send(serializer({
            code: CODE_SERVER_RECEIVE_ADMIN_MESSAGE,
            data: {
              message,
              uuid,
              host,
              port,
              date: new Date().toISOString()
            },
            msg: ''
          }))
        }
      })

      ws.on('error', (e) => {
        console.log(e)
        rootWs.send(serializer({
          code: CODE_UNEXPECTED_ERROR,
          msg: 'server seem to have some error.',
          error: e.message
        }))
      })

      ws.on('close', () => {
        console.log('ws closed.')
      })
    })

    wss.on('error', (e) => {
      console.log(e)
      rootWs.send(serializer({
        code: CODE_NEW_SOCKET_SERVER_FAIL,
        msg: `create websocket server for ws://${host}:${port} is failed.`,
        error: e.message
      }))
    })

    wss.on('listening', () => {
      console.log('emit listening...')

      // insert new server to mysql.
      const createdTime = new Date()
      const createdTimestamp = +createdTime
      pool.query(
        `insert into servers (uuid,host,port,namespace,running,created_at,updated_at,created_at_timestamp,updated_at_timestamp) values (?,?,?,?,?,?,?,?,?);`,
        [newServerUUID, host, port, namespace, 0, createdTime, createdTime, createdTimestamp, createdTimestamp],
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
    })

  } catch (e) {
    rootWs.send(serializer({
      code: CODE_NEW_SOCKET_SERVER_FAIL,
      msg: `create websocket for ws://${host}:${port} is failed.`,
      error: e.message
    }))
  }
}

module.exports = {
  newSocketServer
}
