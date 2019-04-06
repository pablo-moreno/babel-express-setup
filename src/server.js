import express from 'express'
import cors from 'cors'
import session from 'express-session'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import multer from 'multer'
import routes from './routes'
import { DEBUG, SECRET_KEY, UPLOADS_PATH } from './config'
import { none, authenticationRequired, checkPermissions, logger } from './middleware'
import { errorWrapper } from './utils'

// Create server
const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(compression())

let sessionConf = {
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false
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

routes.forEach(route => {
  console.log('-', `[${route.method}]`, route.path)

  const middleware = [
    logger, 
    route.protected ? authenticationRequired : undefined, 
    checkPermissions(route.permissions),
    route.upload ? upload.single(route.upload) : undefined,
  ].filter(m => m !== undefined)

  server[route.method.toLowerCase()](
    route.path, 
    ...middleware,
    errorWrapper(route.controller),
  )
})

export default server
