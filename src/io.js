import sio from 'socket.io'
const io = sio(6226)

const myRooms = ['my-room-1', ]

io.on('connection', function (socket) {
  console.log('Socket connected')
  socket.emit('new-user-connected')

  socket.on('ack-user-connected', function (user) {
    myRooms.forEach(room => {
      socket.join(room)
    })
  })

  socket.on('post-message', function (room, message) {
    console.log('post-message', room, message)
    io.to(room).emit('new-message', message)
  })
})

export default io