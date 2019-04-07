import mongoose from '../../mongoose'
import { Room } from '../rooms'

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

FriendshipRequest.pre('save', (next) => {
  if (this.status === 1) {
    const room = new Room({
      users: [ this.from, this.to, ],
      group: false
    })
    room.save()
  }
})

const FriendshipRequest = mongoose.model('FriendshipRequest', FriendshipRequestSchema)

export default FriendshipRequest
