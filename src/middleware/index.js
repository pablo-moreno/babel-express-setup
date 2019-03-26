import { User } from '../models/auth'
import _ from 'lodash'

export const none = (req, res, next) => next()

export const authenticationRequired = async (req, res, next) => {
  let token = req.header('x-auth') || req.session.token
  
  try {
    const user = await User.findByToken(token)
    if (! user) {
      throw new Error('Invalid authentication credentials')
    }
    req.user = _.pick(user, '_id', 'username', 'email', 'token', 'firstName', 'lastName'),
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

export const checkPermission = (permission) => {
  return async (req, res, next) => {
    if (! permission || req.permissions.indexOf(permission) > -1) {
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

export const logger = (req, res, next) => {
  console.log(`[${req.method}] - ${req.route.path}`)
  next()
}
