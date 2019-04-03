import { FriendshipRequest } from '../../models/chat'
import { User } from '../../models/auth'

export const createFriendshipRequest = async (req, res) => {
  const { to } = req.body
  const { _id } = req.user
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