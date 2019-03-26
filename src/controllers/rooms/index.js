import Room from '../../models/rooms/Room'
import User from '../../models/auth/User'

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
