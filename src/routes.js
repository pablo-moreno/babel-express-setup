import { createUser, login, getMe } from './controllers/auth'

export default [
  {
    path: '/auth/login',
    controller: login,
    method: 'POST',
    authorization: undefined
  },
  {
    path: '/auth/sign-up',
    controller: createUser,
    method: 'POST',
    authorization: undefined
  },
  {
    path: '/auth/me',
    controller: getMe,
    method: 'GET',
    protected: true,
    authorization: undefined
  }
]