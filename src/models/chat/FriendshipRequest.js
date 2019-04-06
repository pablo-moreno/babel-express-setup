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
  // -1 rejected, 0 sent, 1 accepted
  status: {
    type: Number,
    default: 0,
    validator: (value) => [-1, 0, 1].indexOf(value) > -1
  },
  text: {
    type: String,
    default: '',
    required: false
  }
})

const FriendshipRequest = mongoose.model('FriendshipRequest', FriendshipRequestSchema)

export default FriendshipRequest
