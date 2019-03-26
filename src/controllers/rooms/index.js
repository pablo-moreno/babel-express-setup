import { Room } from '../../models/rooms'

export const createRoom = async (req, res) => {
  const { name, users, admin, group } = req.body
  
  const room = new Room({ name, users, admin, group })
  try {
    const result = await room.save()
    res.send(result)
  } catch (error) {
    res.status(400).send({
      status: 400,
      error: error.message
    })
  }
}

export const getRooms = async (req, res) => {
  const { _id } = req.user
  try {
    const rooms = await Room.find({ users: _id })
    res.send(rooms)
  } catch (error) {
    res.status(401).send({
      status: 401,
      error: error.message
    })
  }
}
