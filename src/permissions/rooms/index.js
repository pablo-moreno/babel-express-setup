import { Room } from '../../models/rooms'

const isRoomUser = async (user, _id) => {
  const room = await Room.find({ _id })
  return room.users.indexOf(user._id) > -1
}

const isRoomOwner = async (user, _id) => {
  const room = await Room.find({ _id })
  return room.admin === user._id && room.group
}

export const canSeeRoom = async (user, params) => {
  const { id } = params
  return isRoomUser(user, id)
}

export const canDeleteRoom = async (user, params) => {
  const { id } = params
  return isRoomOwner(user, id)
}

export const canUpdateRoom = async (user, params) => {
  const { id } = params
  return isRoomOwner(user, id)
}
