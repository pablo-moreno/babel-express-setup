import User from '../../models/auth/User'

export const createUser = async (req, res) => {
  const { username, password, password2, email, firstName, lastName } = req.body
  let response = {}
  try {
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
  } 
  catch (error) {
    response = {
      status: 400,
      error: error.message
    }
  }

  res.send(response)
}

export const login = async (req, res) => {
  const { email, password } = req.body
  let response = {}
  try {
    const user = await User.authenticate(email, password)
    response = user
    req.session.email = user.email
    req.session.token = user.token 
  }
  catch (error) {
    response = {
      status: 401,
      error: error.message
    }
  }
  res.send(response)
}

export const getMe = async (req, res) => {
  res.send(req.user)
}