/**
 * @Author: yangqixin
 * @TIME: 2021/8/2 21:19
 * @FILE: index.js
 * @Email: 958292256@qq.com
 */

/**
 * @param dataObject {Object}
 * @returns {string}
 */
export function serializer(dataObject) {
  let result = null
  try {
    result = JSON.stringify(dataObject)
  } catch (e) {
    throw new Error(e)
  }
  return result
}

/**
 *
 * @param dataString {String}
 * @returns {Object}
 */
export function parse(dataString) {
  let result = null
  try {
    result = JSON.parse(dataString)
  } catch (e) {
    throw new Error(e)
  }
  return result
}
