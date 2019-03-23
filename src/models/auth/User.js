import jwt from 'jsonwebtoken'
import mongoose, { Schema } from '../../mongoose'
import { JWT_SECRET } from '../../config'

const Schema = mongoose.Schema

const UserSchema = new Schema({
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
    minlength: 1,
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
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  creationDate: {
    type: Date,
    required: false,
    default: () => Date.now()
  }
})

UserSchema.methods.generateAuthToken = async function () {
  console.log('Generating auth token')
  let user = this
  let token = jwt.sign({_id: user._id.toHexString(), email: user.email}, JWT_SECRET).toString()
  user.tokens.push({ token })
  
  return user.save().then((doc) => doc)
}

UserSchema.methods.removeToken = function (token) {
  let user = this
  return user.update({
    $pull: {
      tokens: {token}
    }
  })
}

UserSchema.statics.findByToken = async function (token) {
  let user = this
  let decoded

  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } 
  catch (error) {
    return Promise.reject('Error verifying token')
  }

  return user.findOne({
    '_id': decoded._id,
    'tokens.token': token,
  })
}

UserSchema.statics.createUser = async function(username, password, password2, email, firstName='', lastName='') {
  return new Promise((resolve, reject) => {
    if (password !== password2) 
      reject({ error: 'Password mismatch' })
    
    hash(password).then((hash) => {
      let user = new User({ 
        username,
        email,
        firstName,
        lastName,
        password: hash,
        tokens: []
      })

      return user.save(doc => doc)
        .then(result => resolve(result))
        .catch(error => reject({ error: error.message })
      )
    })
  })
}

UserSchema.statics.findByCredentials = async function (username, password) {
  return new Promise((resolve, reject) => {
    User.findOne({name: username}, (err, user) => {
      if (! user || err) 
        reject({ error: 'User not found' })
      
      validatePassword(password, user.password, true)
        .then(isValid => user.generateAuthToken())
        .then(result => resolve(user))
        .catch(error => reject({ error: 'Wrong password' }))
    })
  })
}

export default mongoose.model('User', UserSchema)

