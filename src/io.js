import sio from 'socket.io'
import { Room } from './models/rooms'
import { Message } from './models/chat'

const io = sio(6226)

io.sockets.on('connection', function (socket) {
  console.log('Socket connected')
  socket.emit('new-user-connected')

  socket.on('subscribe', function(room) {
    console.log('Subscribing to room: ', room)
    socket.join(room)
  })

  socket.on('unsubscribe', function(room) {
    console.log('Leaving room: ', room)
    socket.leave(room)
  })
  
  socket.on('ack-user-connected', async function (user) {
    console.log('[ACK] - User-connected', user)
    const rooms = await Room.findByUser(user)
    socket.emit('user-rooms', rooms)
  })

  socket.on('post-message', async function ({ text, user, room }) {
    console.log('post-message', { text, user, room })
    const msg = new Message({ text, user: user._id, room: room._id })
    const result = await msg.save()
    io.sockets.in(room._id).emit('new-message', result)
  })
})

export default io
