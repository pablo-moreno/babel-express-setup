import { User } from '../models/auth'
import pick from 'lodash/pick'

export const none = (req, res, next) => next()

export const authenticationRequired = async (req, res, next) => {
  let token = req.header('x-auth') || req.session.token
  
  try {
    const user = await User.findByToken(token)
    if (! user) {
      throw new Error('Invalid authentication credentials')
    }
    req.user = pick(user, '_id', 'username', 'email', 'token', 'firstName', 'lastName'),
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

export const checkPermissions = (permissions) => {
  return async (req, res, next) => {
    const { user, params } = req
    if (permissions.length === 0) {
      next()
    } else {
      const results = []
      permissions.forEach(async permission => {
        try {
          const result = await permission(user, params)
          console.log('result', result)
          results.push(result)
        } catch (error) {
          results.push(false)
        }
      })

      console.log('results', results)

      const ok = results && results.length === results.filter(i => i).length
      ok ? next() : res.send({
        status: 403,
        error: 'Forbidden: you dont have permission to access this url'
      })
    }
  }
}

export const logger = (req, res, next) => {
  console.log(`[${req.method}] - ${req.route.path} - ${JSON.stringify(req.body)}`)
  next()
}
