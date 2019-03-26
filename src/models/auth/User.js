import jwt from 'jsonwebtoken'
import mongoose from '../../mongoose'
import { JWT_SECRET } from '../../config'
import { hashPassword, validatePassword } from '../../utils'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    index: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  token: {
    type: String,
    required: false,
    index: true
  },
  creationDate: {
    type: Date,
    required: false,
    default: () => Date.now()
  },
  active: {
    type: Boolean,
    default: () => true
  }
})

UserSchema.path('email').validate(
  email => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email), 
  'The e-mail is not correct.'
)

UserSchema.methods.generateAuthToken = async function () {
  let user = this
  let token = jwt.sign({ _id: user._id.toHexString(), email: user.email }, JWT_SECRET).toString()
  user.token = token
  
  return user.save()
}

UserSchema.methods.removeToken = async function (token) {
  return this.update({ token: '' })
}

UserSchema.methods.getPermissions = async function () {
  return []
}

UserSchema.statics.findByToken = async function (token) {
  let user = this
  let decoded = jwt.verify(token, JWT_SECRET)

  return user.findOne({
    '_id': decoded._id,
    'token': token,
  })
}

UserSchema.statics.createUser = async function({ username, password, email, firstName = '', lastName = '' }) {
  const hashedPassword = await hashPassword(password)

  let user = new User({ 
    username,
    email,
    firstName,
    lastName,
    password: hashedPassword,
    token: ''
  })
  return user.save()
}

UserSchema.statics.authenticate = async function (email, password) {
  const user = await User.findOne({ email })
  if (! user) throw new Error('User not found')
  
  const isValid = await validatePassword(password, user.password)

  if (!isValid) throw new Error('Wrong username or password')
  if (user.token === '')  user.generateAuthToken()  

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    token: user.token,
    firstName: user.firstName,
    lastName: user.lastName
  }
}

const User = mongoose.model('User', UserSchema)

export default User
