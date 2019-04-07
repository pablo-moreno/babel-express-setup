import mongoose from '../../mongoose'

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    default: '',
    required: false
  }
})

const Notification = mongoose.model('Notification', NotificationSchema)

export default Notification
