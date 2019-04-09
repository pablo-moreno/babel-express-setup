import { FriendshipRequest } from '../../models/chat'
import { User } from '../../models/auth'

export const createFriendshipRequest = async (req, res) => {
  const { to } = req.body
  const _id = req.user
  const user = await User.findOne({ _id })
  if (! user) {
    throw new Error('User not found')
  }
  const friendshipRequest = new FriendshipRequest({ from: _id, to })
  const result = await friendshipRequest.save()
  user.incomingFriendshipRequests.push(result._id)
  user.save()
  res.send(result)
}

export const acceptFriendshipRequest = async (req, res) => {
  const { id } = req.params
  const request = await FriendshipRequest.find({ _id: id })
  request.status = 1
  await request.save()
  res.send({ ok: true })
}

export const refuseFriendshipRequest = async (req, res) => {
  const { id } = req.params
  const request = await FriendshipRequest.find({ _id: id })
  request.status = -1
  await request.save()
  res.send({ ok: true })
}
