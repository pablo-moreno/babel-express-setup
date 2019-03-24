import User from '../models/auth/User'
import _ from 'lodash'

export const none = (req, res, next) => next()

export const authenticationRequired = async (req, res, next) => {
  let token = req.header('x-auth') || req.session.token
  try {
    const user = await User.findByToken(token)
    if (! user) {
      throw new Error('Invalid authentication credentials')
    }
    req.user = _.pick(user, 'username', 'email', 'token', 'firstName', 'lastName'),
    req.permissions = user.getPermissions()
    next()
  }
  catch (error) {
    res.status(401).send({
      status: 401,
      error: error.message
    })
  }
}

const hasPermission = (permission) => {
  return async (req, res, next) => {
    if (req.permissions.indexOf(permission) > -1) {
      next()
    }
    else {
      res.status(403).send({
        status: 403,
        error: 'Forbidden'
      })
    }
  }
}
