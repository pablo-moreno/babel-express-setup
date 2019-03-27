import { User } from '../../models/auth'
import { clean, requestWrapper as rw } from '../../utils'

export const createUser = async (req, res) => {
  const { username, password, password2, email, firstName, lastName } = req.body
  let response = {}
  if (password !== password2) throw new Error('Password mismatch')
  const user = await User.createUser({ username, password, email, firstName, lastName })
  response = {
    id: user._id,
    username: user.username, 
    email: user.email, 
    firstName: user.firstName, 
    lastName: user.lastName, 
    token: user.token
  }
  res.send(response)
}

export const login = async (req, res) => {
  const { email, password } = req.body
  let response = {}
  const user = await User.authenticate(email, password)
  response = user
  req.session.email = user.email
  req.session.token = user.token

  res.send(response)
}

export const getMe = async (req, res) => {
  res.send(req.user)
}

export const updateUser = async (req, res) => {
  const { _id } = req.user
  const user = req.body
  const updates = clean(user)

  const result = await User.updateOne({ _id }, { 
    $set: updates
  })
  res.send(result)
}
