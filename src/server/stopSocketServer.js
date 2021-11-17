/**
 * @Author: yangqixin
 * @TIME: 2021/9/12 14:04
 * @FILE: stopSocketServer.js
 * @Email: 958292256@qq.com
 * @Description: stop a running server.
 */
const { serializer } = require('./util')
const { connectionMap } = require('./connections')
const {
  CODE_SOCKET_STOP_ERROR,
  CODE_SOCKET_STOP_SUCCESS,
  CODE_MISSING_UUID
} = require('./code_config')

function stopSocketServer(rootWs, config) {
  const { uuid, host, port } = config
  console.log('stop server uuid: ', uuid)
  if (!uuid) {
    rootWs.send(serializer({
      code: CODE_MISSING_UUID,
      msg: 'to stop a server, uuid must be provided.',
      data: {
        uuid
      }
    }))
    return
  }
  const existServer = connectionMap.get(uuid)

  if (!existServer) {
    rootWs.send(serializer({
      code: CODE_SOCKET_STOP_ERROR,
      msg: 'could not found a server with uuid ' + uuid,
      data: {
        uuid
      }
    }))
    return
  }

  try {
    existServer.wss.close()
    rootWs.send(serializer({
      code: CODE_SOCKET_STOP_SUCCESS,
      msg: 'server was successfully stop.',
      data: {
        uuid
      }
    }))

    connectionMap.delete(uuid)
  } catch (e) {
    rootWs.send(serializer({
      code: CODE_SOCKET_STOP_ERROR,
      msg: 'stop server for uuid:' + uuid + ' fail, please try again later.',
      error: e,
      data: {
        uuid
      }
    }))
  }
}

module.exports = {
  stopSocketServer
}
