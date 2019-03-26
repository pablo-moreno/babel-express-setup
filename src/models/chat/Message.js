import mongoose from '../../mongoose'

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    unique: false,
    index: true,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  sentDate: {
    type: Date,
    default: () => Date.now()
  },
  read: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: () => Date.now()
    }
  }],
  received: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: () => Date.now()
    }
  }],
})

Message.methods.markAsRead = function (user) {
  const message = this
  message.read.push(user._id)
  message.save()
}

Message.methods.markAsReceived = function (user) {
  const message = this
  message.received.push(user._id)
  message.save()
}

const Message = mongoose.model('Message', MessageSchema)

export default Message
