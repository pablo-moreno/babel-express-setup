import mongoose from '../../mongoose'

const FriendshipRequestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creationDate: {
    type: Date,
    default: () => Date.now()
  },
})

const FriendshipRequest = mongoose.model('FriendshipRequest', FriendshipRequestSchema)

export default FriendshipRequest
