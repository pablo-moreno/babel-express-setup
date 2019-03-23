import sio from 'socket.io'

const io = sio(6226)
const fetchUserRooms = (user) => [{ _id: 'my-room-1' }, ]

io.on('connection', function (socket) {
  console.log('Socket connected')
  socket.emit('new-user-connected')

  socket.on('ack-user-connected', function (user) {
    console.log('user-connected', user)

    const rooms = fetchUserRooms(user)
    rooms.forEach(room => {
      console.log(`User ${user.username} joined ${room._id}`)
      socket.join(room)
    })
    socket.emit('user-rooms', rooms)
  })

  socket.on('post-message', function (message, room) {
    console.log('post-message', room, message)
    io.to(room).emit('new-message', message)
  })
})

export default io
