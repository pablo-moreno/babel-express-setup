import sio from 'socket.io'
import { Room } from './models/rooms'
import { Message } from './models/chat'

const io = sio(6226)

io.sockets.on('connection', function (socket) {
  console.log('Socket connected')
  socket.emit('new-user-connected')

  socket.on('subscribe', function(rooms) {
    console.log('Subscribing to rooms: ', rooms)
    rooms.forEach(room => socket.join(room))
  })

  socket.on('unsubscribe', function(room) {
    console.log('Leaving room: ', room._id)
    socket.leave(room)
  })
  
  socket.on('ack-user-connected', async function (user) {
    console.log('[ACK] - User-connected', user.id, user.username)
    const rooms = await Room.findByUser(user)
    console.log('Rooms', rooms)
    socket.emit('user-rooms', rooms)
  })

  socket.on('post-message', async function ({ text, user, room }) {
    console.log('post-message', user.username, text, room)
    const msg = new Message({ text, user: user.id, room: room })
    const result = await msg.save()
    io.sockets.in(room).emit('new-message', { 
      text, 
      user: {
        id: user.id,
        username: user.username,
      },
      room: room
    })
  })

  socket.on('writing-message', async function({ user, room }) {
    io.sockets.in(room).emit('user-is-writing', { user, room })
  })

  socket.on('stop-writing', async function({ user, room }) {
    io.sockets.in(room).emit('user-stopped-writing', { user, room })
  })
})

export default io
