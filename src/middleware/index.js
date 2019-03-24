export const none = (req, res, next) => next()

export const authenticationRequired = (req, res, next) => {
  if (req.isAuthenticated()) 
    return next()
  else
    return {
      status: 401,
      text: 'You are not authenticated'
    }
}
