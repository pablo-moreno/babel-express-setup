import { createUser, login, getMe } from './controllers/auth'

export default [
  {
    path: '/auth/login',
    controller: login,
    method: 'POST',
  },
  {
    path: '/auth/sign-up',
    controller: createUser,
    method: 'POST',
  },
  {
    path: '/auth/me',
    controller: getMe,
    method: 'GET',
    protected: true
  }
]