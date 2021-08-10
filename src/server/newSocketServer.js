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
  const { host, port } = config
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
      const serverConfig = {
        host: config.host,
        port: config.port,
        project: config.project,
        uuid: newServerUUID,
        status: CODE_ESTABLISHED,
        timestamp: +new Date()
      }

      rootWs.send(serializer({
        code: CODE_NEW_SOCKET_SERVER_SUCCESS,
        msg: `new websocket server:${address} is created and ready for communicate.`,
        data: serverConfig
      }))

      // new wss instance enqueue socket poll.
      connectionMap.set(newServerUUID, {
        ...serverConfig,
        wss
      })

      // insert new server to mysql.
      pool.query(
        `insert into servers (host,port,created_at,timestamp,connecting,uuid) values (?,?,?,?,?,?);`,
        [host, port, new Date(), +new Date(), 1, newServerUUID],
        (err, results, fields) => {
          if (err) {
            console.log(err)
            return
          }
          console.log(results)
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
