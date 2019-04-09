import express from 'express'
import cors from 'cors'
import session from 'express-session'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import multer from 'multer'
import RedisStore from 'connect-redis'
import { DEBUG, SECRET_KEY, UPLOADS_PATH, REDIS_URL } from './config'
import { authenticationRequired, checkPermissions, logger } from './middleware'
import { errorWrapper } from './utils'
import { login, createUser, getMe, updateUser, uploadAvatar, createGroup, searchUsers } from './controllers/auth'
import { getRooms, createRoom, updateRoom } from './controllers/rooms'
import { canSeeRoom, canUpdateRoom, canDeleteRoom } from './permissions/rooms'
import { createFriendshipRequest, acceptFriendshipRequest, refuseFriendshipRequest } from './controllers/chat'

// Create server
const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(compression())

server.use(express.static('media'))

let sessionConf = {
  // store: new RedisStore({ url: REDIS_URL }),
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: true
}

if (DEBUG) {
  server.use(cors())
} else {
  server.use(helmet())
  server.set('trust proxy', 1)
  sessionConf.secure = true
}

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, UPLOADS_PATH)
  },
  filename(req, file, callback) {
    const [extension] = file.originalname.split('.').slice(-1)
    callback(null, `${Date.now()}.${extension}`)
  }
})

const upload = multer({ storage })
server.use(session(sessionConf))

/**
 * @api {post} /auth/login User login
 * @apiName Authenticate user
 * @apiGroup Authentication
 * 
 * @apiParam {String}     email                   User's email
 * @apiParam {String}     password                User's password
 * 
 * @apiSuccess {String}     id                User's Id
 * @apiSuccess {String}     username          User's username
 * @apiSuccess {String}     email             User's email
 * @apiSuccess {String}     token             User's token
 * @apiSuccess {String}     firstName         User's first name
 * @apiSuccess {String}     lastName          User's last name
 */
server.post('/auth/login', logger, checkPermissions([]), errorWrapper(login))

/**
 * @api {post} /auth/sign-up User registration
 * @apiName Create new user
 * @apiGroup Authentication
 * 
 * @apiParam   {String}     username          User's username
 * @apiParam   {String}     password          User's password
 * @apiParam   {String}     password2         Repeat password
 * @apiParam   {String}     email             User's email
 * @apiParam   {String}     firstName         User's first name
 * @apiParam   {String}     lastName          User's last name
 * 
 * @apiSuccess {String}     id                User's Id
 * @apiSuccess {String}     username          User's username
 * @apiSuccess {String}     email             User's email
 * @apiSuccess {String}     token             User's token
 * @apiSuccess {String}     firstName         User's first name
 * @apiSuccess {String}     lastName          User's last name
 */
server.post('/auth/sign-up', logger, checkPermissions([]), errorWrapper(createUser))

/**
 * @api {post} /auth/me Get User data
 * @apiName Get user info
 * @apiGroup Authentication
 * 
 * @apiHeader  {String}     x-auth            User token
 * 
 * @apiSuccess {String}     id                User's Id
 * @apiSuccess {String}     username          User's username
 * @apiSuccess {String}     email             User's email
 * @apiSuccess {String}     token             User's token
 * @apiSuccess {String}     firstName         User's first name
 * @apiSuccess {String}     lastName          User's last name
 */
server.get('/auth/me', logger, authenticationRequired, checkPermissions([]), errorWrapper(getMe))

/**
 * @api {put} /auth/me User update
 * @apiName Update user
 * @apiGroup Authentication
 * 
 * @apiHeader  {String}     x-auth                  User token
 * 
 * @apiParam   {String}     username          User's username
 * @apiParam   {String}     email             User's email
 * @apiParam   {String}     firstName         User's first name
 * @apiParam   {String}     lastName          User's last name
 * 
 * @apiSuccess {Number}     n                 Affected users
 * @apiSuccess {Number}     nModified         Modified users
 * @apiSuccess {Boolean}    ok                Updated ok?
 */
server.put('/auth/me', logger, authenticationRequired, checkPermissions([]), errorWrapper(updateUser))

/**
 * @api {post} /auth/me/avatar Upload user avatar
 * @apiName Upload user avatar
 * @apiGroup Authentication
 * 
 * @apiHeader  {String}     x-auth            User token
 * 
 * @apiParam   {File}       avatar            Image file
 * 
 * @apiSuccess {String}     avatar            Image url
 */
server.post('/auth/me/avatar', logger, authenticationRequired, checkPermissions([]), upload.single('avatar'), errorWrapper(uploadAvatar))

/**
 * @api {post} /auth/me/avatar Upload user avatar
 * @apiName Upload user avatar
 * @apiGroup Authentication
 * 
 * @apiHeader  {String}     x-auth            User token
 * 
 * @apiParam   {File}       avatar            Image file
 * 
 * @apiSuccess {String}     avatar            Image url
 */
server.post('/auth/groups/new', logger, authenticationRequired, checkPermissions([]), errorWrapper(createGroup))

/**
 * @api {get} /rooms Get User Rooms
 * @apiName Get User Rooms
 * @apiGroup Rooms
 * 
 * @apiHeader  {String}     x-auth                  User token
 * 
 * @apiSuccess {String}     _id                     Room ID
 * @apiSuccess {String}     name                    Room name
 * @apiSuccess {Boolean}    group                   Is group
 * @apiSuccess {String}     admin                   Admin's user id
 * @apiSuccess {Object[]}   users                   Room users
 * @apiSuccess {String}     users._id               User's Id
 * @apiSuccess {String}     users.username          User's username
 * @apiSuccess {String}     users.email             User's email
 */
server.get('/rooms', logger, authenticationRequired, checkPermissions([]), errorWrapper(getRooms))

/**
 * @api {post} /rooms Create new Room
 * @apiName Create new Room
 * @apiGroup Rooms
 * 
 * @apiHeader  {String}     x-auth                  User token
 * 
 * @apiParam   {String}     _id                     Room ID
 * @apiParam   {String}     name                    Room name
 * @apiParam   {Boolean}    group                   Is group
 * @apiParam   {String}     admin                   Admin's user id
 * @apiParam   {Object[]}   users                   Room users
 * 
 * @apiSuccess {String}     _id                     Room ID
 * @apiSuccess {String}     name                    Room name
 * @apiSuccess {Boolean}    group                   Is group
 * @apiSuccess {String}     admin                   Admin's user id
 * @apiSuccess {Object[]}   users                   Room users
 * @apiSuccess {String}     users._id               User's Id
 * @apiSuccess {String}     users.username          User's username
 * @apiSuccess {String}     users.email             User's email
 */
server.post('/rooms', logger, authenticationRequired, checkPermissions([]), errorWrapper(createRoom))

/**
 * @api {get} /rooms/:id Get Room data
 * @apiName Get Room data
 * @apiGroup Rooms
 * 
 * @apiHeader  {String}   x-auth                  User token
 * 
 * @apiParam {String}     name                    Room name
 * @apiParam {Boolean}    group                   Is group
 * @apiParam {String}     admin                   User's Id
 * @apiParam {String[]}   users                   Room users ids
 */
server.get('/rooms/:id', logger, authenticationRequired, checkPermissions([ canSeeRoom ]), errorWrapper(getRooms))

/**
 * @api {put} /rooms Update Room
 * @apiName Update Room
 * @apiGroup Rooms
 * 
 * @apiHeader  {String}     x-auth                  User token
 * 
 * @apiParam   {String}     _id                     Room ID
 * @apiParam   {String}     name                    Room name
 * @apiParam   {Boolean}    group                   Is group
 * @apiParam   {String}     admin                   Admin's user id
 * @apiParam   {String[]}   users                   Room users
 * 
 * @apiSuccess {Number}     n                 Affected users
 * @apiSuccess {Number}     nModified         Modified users
 * @apiSuccess {Boolean}    ok                Updated ok?
 */
server.put('/rooms/:id', logger, authenticationRequired, checkPermissions([ canUpdateRoom ]), errorWrapper(updateRoom))

/**
 * @api {delete} /rooms/:id Delete Room
 * @apiName Delete Room
 * @apiGroup Rooms
 * 
 * @apiHeader  {String}     x-auth                  User token
 */
server.delete('/rooms/:id', logger, authenticationRequired, checkPermissions([ canDeleteRoom ]), errorWrapper(updateRoom))

// Friendship requests
server.post('/friendships/new', logger, authenticationRequired, checkPermissions([]), errorWrapper(createFriendshipRequest))
server.post('/friendships/:id/accept', logger, authenticationRequired, checkPermissions([]), errorWrapper(acceptFriendshipRequest))
server.post('/friendships/:id/refuse', logger, authenticationRequired, checkPermissions([]), errorWrapper(refuseFriendshipRequest))

// Users
server.get('/users', logger, authenticationRequired, checkPermissions([]), errorWrapper(searchUsers))

export default server
