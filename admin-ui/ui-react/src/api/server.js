import { createServer } from 'miragejs'

// eslint-disable-next-line
const server = createServer({
  routes() {
    this.namespaces = '/fake'
  }
})

/**
 * mockAPI可以像这样，在下面添加路由配置
 * server.get('/fake/api/xxx/xxx',(schema, request) => {
 *   return {
 *     "code": 1,
 *     "msg": "success",
 *     "data": []
 *   }
 * })
 */

