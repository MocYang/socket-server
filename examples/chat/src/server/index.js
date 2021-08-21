/**
 * @Author: yangqixin
 * @TIME: 2021/7/30 23:44
 * @FILE: index.js
 * @Email: 958292256@qq.com
 */
const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = new Server(server)

// set static file root path.
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/index.html'))
})

io.on('connection', socket => {
  console.log('a user connected!')

  socket.on('chat message', msg => {
    console.log('receive message from client: ', msg)

    socket.emit('server message', msg)
  })
})

server.listen(3000, () => {
  console.log('Server start on : 127.0.0.1:3000')
  // 打开默认浏览器
  // open('http://127.0.0.1:3000', {
  //   newInstance: false
  // })
})
