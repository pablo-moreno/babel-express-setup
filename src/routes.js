import { createUser, login, getMe, updateUser, createGroup, searchUsers, uploadAvatar } from './controllers/auth'
import { createRoom, getRooms, deleteRoom, updateRoom, getRoom } from './controllers/rooms'
import { canDeleteRoom, canUpdateRoom, canSeeRoom } from './permissions/rooms'
import { createFriendshipRequest, acceptFriendshipRequest, refuseFriendshipRequest } from './controllers/chat'
import { single } from 'multer'

const validator = route => ['GET', 'POST', 'PUT', 'DELETE'].indexOf(route.method) > -1

export default [
  {
    path: '/auth/login',
    controller: login,
    method: 'POST',
    permissions: [],
    middleware: []
  },
  {
    path: '/auth/sign-up',
    controller: createUser,
    method: 'POST',
    permissions: [],
    middleware: [],
  },
  {
    path: '/auth/me',
    controller: getMe,
    method: 'GET',
    protected: true,
    permissions: [],
    middleware: [],
  },
  {
    path: '/auth/me',
    controller: updateUser,
    method: 'PUT',
    protected: true,
    permissions: [],
  },
  {
    path: '/auth/me/avatar',
    controller: uploadAvatar,
    method: 'POST',
    protected: true,
    permissions: [],
    upload: 'avatar',
    middleware: []
  },
  {
    path: '/auth/groups/new',
    controller: createGroup,
    method: 'POST',
    protected: true,
    permissions: [],
    middleware: [],
  },
  
  // Rooms
  {
    path: '/rooms',
    controller: createRoom,
    method: 'POST',
    protected: true,
    permissions: [],
    middleware: [],
  },
  {
    path: '/rooms',
    controller: getRooms,
    method: 'GET',
    protected: true,
    permissions: [],
    middleware: [],
  },
  {
    path: '/rooms/:id',
    controller: getRoom,
    method: 'GET',
    protected: true,
    permissions: [
      canSeeRoom
    ],
    middleware: [],
  },
  {
    path: '/rooms/:id',
    controller: updateRoom,
    method: 'PUT',
    protected: true,
    permissions: [
      canUpdateRoom
    ],
    middleware: [],
  },
  {
    path: '/rooms/:id',
    controller: deleteRoom,
    method: 'DELETE',
    protected: true,
    permissions: [
      canDeleteRoom
    ],
    middleware: [],
  },
  {
    path: '/friendships/new',
    controller: createFriendshipRequest,
    method: 'POST',
    protected: true,
    permissions: [],
    middleware: [],
  },
  {
    path: '/friendships/:id/accept',
    controller: acceptFriendshipRequest,
    method: 'POST',
    protected: true,
    permissions: [],
    middleware: [],
  },
  {
    path: '/friendships/:id/refuse',
    controller: refuseFriendshipRequest,
    method: 'POST',
    protected: true,
    permissions: [],
    middleware: [],
  },

  // Users
  {
    path: '/users',
    controller: searchUsers,
    method: 'GET',
    protected: true,
    permissions: [],
    middleware: [],
  }
]
