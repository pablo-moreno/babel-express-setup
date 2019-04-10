import { Room } from '../../models/rooms'
import { clean } from '../../utils'

export const createRoom = async (req, res) => {
  const { name, users, admin, group } = req.body
  const room = new Room({ name, users, admin, group })
  const result = await room.save()
  
  res.send(result)
}

export const getRooms = async (req, res) => {
  const { _id } = req.user
  const pop = { path: 'users', select: 'username email' }
  const rooms = await Room.find({ users: _id }).populate(pop)
  res.send(rooms)
}

export const getRoom = async (req, res) => {
  const { id } = req.params
  const pop = { path: 'users', select: 'username email' }
  const room = await Room.findOne({ _id: id }).populate(pop)

  if (! room) {
    res.status(404).send(room)
  } else {
    res.send(room)
  }
}

export const deleteRoom = async (req, res) => {
  const { id } = req.params
  await Room.deleteOne({ _id: id })
  res.status(204)
}

export const updateRoom = async (req, res) => {
  const { id } = req.params
  const { users, name, admin } = req.body

  const result = await Room.updateOne({ _id: id }, {
    $set: clean({ users, name, admin })
  })
  res.send(result)
}
