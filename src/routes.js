import { createUser, login, getMe } from './controllers/auth'
import { createRoom } from './controllers/rooms'

const validator = route => ['GET', 'POST', 'PUT', 'DELETE'].indexOf(route.method) > -1

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
  },
  {
    path: '/rooms/new',
    controller: createRoom,
    method: 'POST',
    protected: true,
    authorization: undefined
  }
]