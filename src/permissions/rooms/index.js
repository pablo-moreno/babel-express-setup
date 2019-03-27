import { Room } from '../../models/rooms'

const isRoomUser = async (user, _id) => {
  const room = await Room.find({ _id })
  return room.users.indexOf(user._id) > -1
}

const isRoomOwner = async (user, _id) => {
  const room = await Room.findOne({ _id })
  return room.admin.toString() === user._id.toString() && room.group
}

export const canSeeRoom = async (user, params) => {
  const { id } = params
  // return isRoomUser(user, id)
  return true
}

export const canDeleteRoom = async (user, params) => {
  const { id } = params
  return isRoomOwner(user, id)
}

export const canUpdateRoom = async (user, params) => {
  const { id } = params
  return isRoomOwner(user, id)
}
