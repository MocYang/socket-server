/**
 * @Author: MocYang
 * @Email: 958292256@qq.com
 * @Date: 2021/8/3 13:52
 * @File: startSocketServer.js
 * @Description
 */
const WebSocket = require('ws')
const {
  serializer,
  parseSocketMsg
} = require('./util')
const {connectionMap} = require('./connections')
const {
  CODE_SOCKET_START_ERROR,
  CODE_SOCKET_START_SUCCESS,
  CODE_ESTABLISHED,
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
  const {uuid} = config

  if (!uuid) {
    rootWs.send(serializer({
      code: CODE_SOCKET_START_ERROR,
      msg: 'To start a websocket server, uuid is required.',
      data: ''
    }))
    return
  }

  const wssConfig = connectionMap.get(uuid)
  if (!wssConfig) {
    rootWs.send(serializer({
      code: CODE_SOCKET_START_ERROR,
      msg: `can not found a socket server for uuid: ${uuid}.`,
      data: ''
    }))
    return
  }
  const host = wssConfig.host
  const port = wssConfig.port
  const address = `ws://${wssConfig.host}:${wssConfig.port}`
  try {

    const wss = new Server({
      // host,
      port,
      clientTracking: true,
      perMessageDeflate: false
    })

    wss.on('connection', (ws, req) => {

      ws.on('open', () => {
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
        console.log('connection is closed.', parseSocketMsg(reasonBuffer))
      })
    })

    wss.on('error', (e) => {
      console.log(`start websocket: ${address} fail.`)
      rootWs.send(serializer({
        code: CODE_SOCKET_START_ERROR,
        msg: `start websocket: ${address} fail.`,
        error: e.message
      }))
    })

    wss.on('listening', () => {
      console.log(`start websocket: ${address} success.`)
      const serverConfig = {
        ...wssConfig,
        status: CODE_ESTABLISHED,
        timestamp: +new Date()
      }

      rootWs.send(serializer({
        code: CODE_SOCKET_START_SUCCESS,
        msg: `start websocket: ${address} success.`,
        data: serverConfig
      }))

      // update connectionMap status
      connectionMap.set(uuid, serverConfig)
    })

    wss.on('close', () => {
      console.log('websocket server is closed.')
    })
  } catch (e) {
    rootWs.send(serializer({
      code: CODE_SOCKET_START_ERROR,
      msg: `start socket server fail. socket server: host:${host}; port${port}.`,
      error: e.message
    }))
  }
}

module.exports = {
  startSocketServer
}
