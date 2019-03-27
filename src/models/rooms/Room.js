import mongoose from '../../mongoose'

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    index: true,
    required: false,
    trim: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  creationDate: {
    type: Date,
    default: () => Date.now()
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  group: {
    type: Boolean,
    default: false
  }
})

RoomSchema.statics.findByUser = function (user) {
  let room = this
  return this.find({ users: user._id }).populate({
    path: 'users', 
    select: 'username email'
  })
}

const Room = mongoose.model('Room', RoomSchema)

export default Room
