import { createUser, login } from './controllers/auth'

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
]