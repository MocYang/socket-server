/**
 * @Author: MocYang
 * @Email: 958292256@qq.com
 * @Date: 2021/8/3 13:52
 * @File: startSocketServer.js
 * @Description
 */
const WebSocket = require('ws')
const { serializer } = require('./util')
const { pool } = require('../DB/connectionPool')
const { parseSocketMsg } = require('./util')
const { connectionMap } = require('./connections')
const {
  CODE_SOCKET_START_ERROR,
  CODE_SOCKET_START_SUCCESS,
  CODE_OPEN,
  CODE_UNEXPECTED_ERROR,
  CODE_SERVER_RECEIVE_ADMIN_MESSAGE,
  CODE_ADMIN_CLIENT_PUSH_MESSAGE,
  CODE_MESSAGE_SEND_FROM_SERVER,
  CODE_ESTABLISHED
} = require('./code_config.js')

const Server = WebSocket.Server

/**
 * @description start an exist socket server.
 * @param rootWs {WebSocket}
 * @param config {Object}
 */
function startSocketServer(rootWs, config) {
  console.log('start socket server:', config)
  const { uuid } = config

  if (!uuid) {
    rootWs.send(serializer({
      code: CODE_SOCKET_START_ERROR,
      msg: 'To start a websocket server, uuid is required.',
      data: ''
    }))
    return
  }
  if (connectionMap.get(uuid)) {
    rootWs.send(serializer({
      code: CODE_ESTABLISHED,
      msg: `server for ${uuid} is already running.`,
      data: {
        uuid
      }
    }))
    return
  }

  pool.query(
    `select * from servers where uuid=(?)`,
    [uuid],
    (err, results) => {
      if (err) {
        rootWs.send(serializer({
          code: CODE_SOCKET_START_ERROR,
          msg: `start socket server fail. uuid=${uuid}`,
          error: err
        }))
        return
      }
      const serverToStart = Object.assign({}, Array.from(results)[0])

      if (!serverToStart) {
        rootWs.send(serializer({
          code: CODE_SOCKET_START_ERROR,
          msg: `can not found a socket server for uuid: ${uuid}.`,
          error: null
        }))
        return
      }
      const host = serverToStart.host
      const port = serverToStart.port
      const address = `ws://${host}:${port}`
      try {
        const wss = new Server({
          port,
          clientTracking: true,
          perMessageDeflate: false
        })

        wss.on('connection', (ws, req) => {
          ws.on('open', () => {
            console.log(`server ws://${host}:${port}, is start.`)
            ws.send(serializer({
              code: CODE_OPEN,
              msg: `WebSocket is connected.`,
              data: ''
            }))

            console.log('all connected client:', wss.clients)
          })

          ws.on('message', (msgBuffer) => {
            // TODO: handle sub socket message event.
            const msgObj = parseSocketMsg(msgBuffer)
            console.log('receive message from client:', msgObj)
            // message from admin client. means this message show send to all connected clients.
            const { code, data } = msgObj
            if (code === CODE_ADMIN_CLIENT_PUSH_MESSAGE) {
              // other client send data to this server.
              const dataSendToClient = {
                host,
                port,
                uuid,
                message: msgObj.data.message,
                sendTime: new Date().toISOString()
              }
              // send a confirm message to admin socket client.
              ws.send(serializer({
                code: CODE_SERVER_RECEIVE_ADMIN_MESSAGE,
                msg: 'receive message success.',
                data: dataSendToClient
              }))

              // send message to all other connected clients.
              Array.from(wss.clients).slice(1).forEach(socket => {
                // socket.send(serializer({
                //   code: CODE_MESSAGE_SEND_FROM_SERVER,
                //   msg: 'server push message.',
                //   data: dataSendToClient
                // }))
                socket.send(serializer(parseSocketMsg(msgObj.data.message)))
              })
            } else {
              console.log('other client send message: ', data.message)
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

          ws.on('close', (code, reasonBuffer) => {
            console.log('connection is closed.', reasonBuffer)
          })
        })

        wss.on('error', (e) => {
          console.log(`start websocket: ${address} fail.`, e)
          rootWs.send(serializer({
            code: CODE_SOCKET_START_ERROR,
            msg: `start websocket: ${address} fail.`,
            error: e.message
          }))
        })

        wss.on('listening', () => {
          console.log(`start websocket: ${address} success.`)
          rootWs.send(serializer({
            code: CODE_SOCKET_START_SUCCESS,
            msg: `start websocket: ${address} success.`,
            data: {
              host,
              port,
              uuid
            }
          }))

          // cache running server.
          connectionMap.set(uuid, {
            host,
            port,
            wss
          })
        })

        wss.on('close', () => {
          console.log('websocket server is closed.')
          pool.query(
            `update servers set running=(?) where uuid=(?)`,
            [0, uuid],
            (err) => {
              if (err) {
                console.log('update server running status fail.')
                return
              }
              console.log('server is shut down.')
            }
          )
        })
      } catch (e) {
        rootWs.send(serializer({
          code: CODE_SOCKET_START_ERROR,
          msg: `start socket server fail. socket server: host:${host}; port${port}.`,
          error: e.message
        }))
      }
    }
  )
}

module.exports = {
  startSocketServer
}
