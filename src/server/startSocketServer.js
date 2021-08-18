/**
 * @Author: MocYang
 * @Email: 958292256@qq.com
 * @Date: 2021/8/3 13:52
 * @File: startSocketServer.js
 * @Description
 */
const WebSocket = require('ws')
const {
  serializer
} = require('./util')
const { pool } = require('../DB/connectionPool')

const {
  CODE_SOCKET_START_ERROR,
  CODE_SOCKET_START_SUCCESS,
  CODE_OPEN,
  CODE_UNEXPECTED_ERROR
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
          })

          ws.on('message', (msgBuffer) => {
            // TODO: handle sub socket message event.
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

          // update server status to database
          pool.query(
            `update servers set running=(?),updated_at=(?), updated_at_timestamp=(?) where uuid=(?)`,
            [1, new Date(), +new Date(), uuid],
            (err, results) => {
              if(err) {
                console.log(err)
                rootWs.send(serializer({
                  code: CODE_SOCKET_START_ERROR,
                  msg: `start websocket: ${address} fail.`,
                  error: err
                }))
                return
              }
              rootWs.send(serializer({
                code: CODE_SOCKET_START_SUCCESS,
                msg: `start websocket: ${address} success.`,
                data: null
              }))
            }
          )
        })

        wss.on('close', () => {
          console.log('websocket server is closed.')
          pool.query(
            `update servers set running=(?) where uuid=(?)`,
            [0, uuid],
            (err, result) => {
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
