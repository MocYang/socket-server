/**
 * @Author: yangqixin
 * @TIME: 2021/8/1 20:27
 * @FILE: util.js
 * @Email: 958292256@qq.com
 */
/**
 * @description parse buffer message to  human-readable string.
 * @param msgBuffer {Buffer}
 * @returns {null | Object}
 */
function parseSocketMsg(msgBuffer) {
  const msgString = msgBuffer.toString()
  console.log(msgString)
  let msgObj = null
  try {
    msgObj = JSON.parse(msgString)
  } catch (e) {
    if (typeof msgString === 'string') {
      return {
        data: msgString
      }
    }
    throw new Error(e)
  }
  return msgObj
}

/**
 * @description serialize data for socket to send.
 * @param data {Object}
 * @returns {string}
 */
function serializer(data) {
  return JSON.stringify(data)
}

module.exports = {
  parseSocketMsg,
  serializer
}
