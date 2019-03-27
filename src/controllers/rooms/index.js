import { Room } from '../../models/rooms'

export const createRoom = async (req, res) => {
  const { name, users, admin, group } = req.body
  const room = new Room({ name, users, admin, group })
  const result = await room.save()
  
  res.send(result)
}

export const getRooms = async (req, res) => {
  const { _id } = req.user
  const rooms = await Room.find({ users: _id })
    .populate({ path: 'users', select: 'username email'})
  res.send(rooms)
}

export const getRoom = async (req, res) => {
  const { id } = req.params
  const room = await Room.findOne({ _id: id })
    .populate({ path: 'users', select: 'username email'})
  res.send(room)
}

export const deleteRoom = async (req, res) => {
  const { id } = req.params
  const result = await Room.deleteOne({ _id: id })
  res.send(result)
}

export const updateRoom = async (req, res) => {
  const { id } = req.params
  const { room } = req.body
  const result = await Room.updateOne({ _id: id }, {
    $set: room
  })
  res.send(result)
}