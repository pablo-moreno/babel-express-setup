import { createUser, login, getMe, updateUser, createGroup, searchUsers } from './controllers/auth'
import { createRoom, getRooms, deleteRoom, updateRoom, getRoom } from './controllers/rooms'
import { canDeleteRoom, canUpdateRoom, canSeeRoom } from './permissions/rooms'
import { createFriendshipRequest, acceptFriendshipRequest, refuseFriendshipRequest } from './controllers/chat'

const validator = route => ['GET', 'POST', 'PUT', 'DELETE'].indexOf(route.method) > -1

export default [
  {
    path: '/auth/login',
    controller: login,
    method: 'POST',
    permissions: [],
  },
  {
    path: '/auth/sign-up',
    controller: createUser,
    method: 'POST',
    permissions: [],
  },
  {
    path: '/auth/me',
    controller: getMe,
    method: 'GET',
    protected: true,
    permissions: [],
  },
  {
    path: '/auth/me',
    controller: updateUser,
    method: 'PUT',
    protected: true,
    permissions: [],
  },
  {
    path: '/auth/groups/new',
    controller: createGroup,
    method: 'POST',
    protected: true,
    permissions: []
  },
  
  // Rooms
  {
    path: '/rooms',
    controller: createRoom,
    method: 'POST',
    protected: true,
    permissions: [],
  },
  {
    path: '/rooms',
    controller: getRooms,
    method: 'GET',
    protected: true,
    permissions: [],
  },
  {
    path: '/rooms/:id',
    controller: getRoom,
    method: 'GET',
    protected: true,
    permissions: [
      canSeeRoom
    ],
  },
  {
    path: '/rooms/:id',
    controller: updateRoom,
    method: 'PUT',
    protected: true,
    permissions: [
      canUpdateRoom
    ],
  },
  {
    path: '/rooms/:id',
    controller: deleteRoom,
    method: 'DELETE',
    protected: true,
    permissions: [
      canDeleteRoom
    ],
  },
  {
    path: '/friendships/new',
    controller: createFriendshipRequest,
    method: 'POST',
    protected: true,
    permissions: []
  },
  {
    path: '/friendships/:id/accept',
    controller: acceptFriendshipRequest,
    method: 'POST',
    protected: true,
    permissions: []
  },
  {
    path: '/friendships/:id/refuse',
    controller: refuseFriendshipRequest,
    method: 'POST',
    protected: true,
    permissions: []
  },

  // Users
  {
    path: '/users',
    controller: searchUsers,
    method: 'GET',
    protected: true,
    permissions: []
  }
]
