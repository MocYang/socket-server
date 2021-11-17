// eslint-disable
/**
 * @Author: MocYang
 * @Email: 958292256@qq.com
 * @Date: 2021/8/2 9:29
 * @File: code_config.js
 * @Description socket 的请求和响应的code配置
 */

/*  connection relative  */
const CODE_CONNECTING                            =    0b00000000   // 0   The connection is not yet open.
const CODE_ESTABLISHED                           =    0b00000001   // 1   The Socket Server is created, and ready to connect.
const CODE_OPEN                                  =    0b00000010   // 2   The connection is open and ready to communicate.
const CODE_CLOSING                               =    0b00000011   // 3   The connection is in the process of closing.
const CODE_CLOSED                                =    0b00000100   // 4   The connection is closed.

/*  data transform relative  */
const CODE_NEW_SOCKET_SERVER                     =    0b00000101   // 5   client request to create a new socket server.
const CODE_NEW_SOCKET_SERVER_SUCCESS             =    0b00000110   // 6   server create socket server success.
const CODE_NEW_SOCKET_SERVER_FAIL                =    0b00000111   // 7   server cannot create new socket server due to some error.

const CODE_SOCKET_START                          =    0b00001000   // 8   restart an exist socket server.
const CODE_SOCKET_START_SUCCESS                  =    0b00001001   // 9   restart an exist socket server success.
const CODE_SOCKET_START_ERROR                    =    0b00001010   // 10  restart an exist socket server fail.

const CODE_SOCKET_STOP                           =    0b00001011   // 11  stop an exist socket server.
const CODE_SOCKET_STOP_SUCCESS                   =    0b00001100   // 12  stop an exist socket server success.
const CODE_SOCKET_STOP_ERROR                     =    0b00001101   // 13  stop an exist socket server fail.

const CODE_ADMIN_CLIENT_PUSH_MESSAGE             =    0b00001110   // 14 admin socket client push a new message.
const CODE_SERVER_RECEIVE_ADMIN_MESSAGE          =    0b00001111   // 15 server receive admin socket client's new message.

const CODE_GET_SERVER_LIST                       =    0b00010000   // 16 get all socket server.
const CODE_GET_SERVER_LIST_SUCCESS               =    0b00010001   // 17 get all socket server success.
const CODE_GET_SERVER_LIST_FAIL                  =    0b00010010   // 18 get all socket server fail.

const CODE_MESSAGE_SEND_FROM_SERVER              =    0b00010011   // 19 socket server send message to client.

const CODE_AUTO_SEND_MESSAGE                     =    0b00010100   // 20 config server auto send message to all client.
const CODE_CANCEL_AUTO_SEND_MESSAGE              =    0b00010101   // 21 cancel server auto send message to all client.

const CODE_DELETE_SOCKET_SERVER                  =    0b00010110   // 22 delete a socket server.
const CODE_DELETE_SOCKET_SERVER_FAIL             =    0b00010111   // 23 delete a socket server fail.
const CODE_DELETE_SOCKET_SERVER_SUCCESS          =    0b00011000   // 24 delete a socket server success.

const CODE_UNEXPECTED_ERROR                      =    0b10000000   // XXX server occur some error.
const CODE_MISSING_UUID                          =    0b10000001   // server receive message, but not specify uuid.
const CODE_INVALID_UUID                          =    0b10000001   // server receive message, but not specify uuid.

module.exports = {
  CODE_CONNECTING,
  CODE_ESTABLISHED,
  CODE_OPEN,
  CODE_CLOSING,
  CODE_CLOSED,

  CODE_NEW_SOCKET_SERVER,
  CODE_NEW_SOCKET_SERVER_SUCCESS,
  CODE_NEW_SOCKET_SERVER_FAIL,

  CODE_UNEXPECTED_ERROR,

  CODE_SOCKET_START,
  CODE_SOCKET_START_SUCCESS,
  CODE_SOCKET_START_ERROR,

  CODE_SOCKET_STOP,
  CODE_SOCKET_STOP_SUCCESS,
  CODE_SOCKET_STOP_ERROR,

  CODE_ADMIN_CLIENT_PUSH_MESSAGE,
  CODE_SERVER_RECEIVE_ADMIN_MESSAGE,
  CODE_MISSING_UUID,
  CODE_INVALID_UUID,

  CODE_AUTO_SEND_MESSAGE,
  CODE_CANCEL_AUTO_SEND_MESSAGE,

  CODE_MESSAGE_SEND_FROM_SERVER,

  CODE_DELETE_SOCKET_SERVER,
  CODE_DELETE_SOCKET_SERVER_FAIL,
  CODE_DELETE_SOCKET_SERVER_SUCCESS,

  CODE_GET_SERVER_LIST,
  CODE_GET_SERVER_LIST_SUCCESS,
  CODE_GET_SERVER_LIST_FAIL
}
