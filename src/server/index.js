/**
 * @Author: yangqixin
 * @TIME: 2021/7/30 23:16
 * @FILE: index.js
 * @Email: 958292256@qq.com
 */
const WebSocket = require('ws')
const http = require('http')
const uuid = require('uuid')
const { parseSocketMsg } = require('./util')
const { newSocketServer } = require('./newSocketServer')
const { startSocketServer } = require('./startSocketServer')
const { apiGetServerList } = require('./apiGetServerList')
const { connectionMap } = require('./connections')

const {
  CODE_NEW_SOCKET_SERVER,
  CODE_SOCKET_START,
  CODE_GET_SERVER_LIST
} = require('./code_config.js')

const Server = WebSocket.Server
const server = http.createServer()

const rootWebSocketServerHost = ''
const rootWebSocketServerPort = 8888
const rootWebSocketServerUUID = uuid.v1()    // v1() -- timestamp base.

const rootWss = new Server({
  perMessageDeflate: false,
  server
})

rootWss.on('connection', (rootWs) => {
  console.log('WebSocketServer is connected.')

  rootWs.on('open', () => {
    console.log('root Ws emit onopen.')
  })

  rootWs.on('message', (msgBuffer) => {
    const msgObj = parseSocketMsg(msgBuffer)
    if (!msgObj) {
      // todo: client send invalid data that cannot parse. warn the client.
      return
    }

    console.log('root ws receive msg: ', msgObj)

    switch (msgObj.code) {
      //  socket admin request new socket server
      case CODE_NEW_SOCKET_SERVER:
        newSocketServer(rootWs, msgObj.data)
        break

      //  socket admin request start a socket server. if socket(uuid) not exit, warn client.
      case CODE_SOCKET_START:
        startSocketServer(rootWs, msgObj.data)
        break

      // socket admin request get all server instance.
      case CODE_GET_SERVER_LIST:
        apiGetServerList(rootWs)
        break
      default:
        break
    }
  })

  rootWs.on('error', (e) => {
    console.log('root ws error: ', e)
  })

  rootWs.on('close', () => {
    console.log('rootWs was closed.')
  })

  // cache root server
  connectionMap.set(rootWebSocketServerUUID, {
    host: rootWebSocketServerHost,
    port: rootWebSocketServerPort,
    uuid: rootWebSocketServerUUID,
    ws: rootWs
  })
})

rootWss.on('listening', () => {
  console.log('root wss is now running.')
})

rootWss.on('error', (e) => {
  console.log('root wss emit error: ', e)
})

rootWss.on('close', () => {
  console.log('root wss closed.')
  connectionMap.delete(rootWebSocketServerUUID)
})

server.on('error', (e) => {
  console.log('server error', e)
})

try {
  server.listen(rootWebSocketServerPort, () => {
    console.log(`Server listen on: ws://127.0.0.1:${rootWebSocketServerPort}`)
  })
} catch (e) {
  console.log(e)
}
