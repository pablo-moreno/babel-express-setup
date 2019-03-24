export const none = (req, res, next) => next()

export const authenticationRequired = (req, res, next) => {
  const { email, token } = req.session
  if (email && token) 
    return next()
  else
    return {
      status: 401,
      text: 'You are not authenticated'
    }
}
