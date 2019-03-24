import { User } from '../models/auth/User'
import _ from 'lodash'

export const none = (req, res, next) => next()

export const authenticationRequired = async (req, res, next) => {
  let token = req.header('x-auth')
  try {
    const user = await User.findByToken(token)
    if (! user) {
      throw new Error('Invalid authentication credentials')
    }
    req.user = {
      user: _.pick(user, 'username', 'email'),
      token
    }
    next()
  }
  catch (error) {
    res.status(401).send({
      status: 401,
      error: error.message
    })
  }
}
