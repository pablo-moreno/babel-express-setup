import mongoose from '../../mongoose'

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index: true,
    required: false,
    trim: true
  },
  permissions: [{
    type: String,
    required: true
  }],
  creationDate: {
    type: Date,
    default: () => Date.now()
  },
})

const Group = mongoose.model('Group', GroupSchema)

export default Group
