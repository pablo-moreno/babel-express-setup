import { Room } from '../../models/rooms'

const isRoomUser = async (user, _id) => {
  const room = await Room.findOne({ _id })
  return room.users.indexOf(user._id) > -1
}

const isRoomOwner = async (user, _id) => {
  const room = await Room.findOne({ _id })
  return room.admin.toString() === user._id.toString() && room.group
}

export const canSeeRoom = async (user, params) => {
  const { id } = params
  const canSee = await isRoomUser(user, id)
  return canSee === true
}

export const canDeleteRoom = async (user, params) => {
  const { id } = params
  return isRoomOwner(user, id)
}

export const canUpdateRoom = async (user, params) => {
  const { id } = params
  return isRoomOwner(user, id)
}
