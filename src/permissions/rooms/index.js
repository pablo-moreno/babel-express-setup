import { Room } from '../../models/rooms'

const isRoomOwner = async (user, _id) => {
  const room = await Room.find({ _id })
  return room.admin === user._id && room.group
}

export const canDeleteRoom = async (user, params) => {
  const { id } = params
  return isRoomOwner(user, id)
}

export const canUpdateRoom = async (user, params) => {
  const { id } = params
  return isRoomOwner(user, id)
}
