import express from 'express'
import cors from 'cors'
import session from 'express-session'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import routes from './routes'
import { DEBUG, SECRET_KEY } from './config'
import { none, authenticationRequired, checkPermission, logger } from './middleware'

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
}
else {
  server.use(helmet())
  server.set('trust proxy', 1)
  sessionConf.secure = true
}

server.use(session(sessionConf))

routes.forEach(route => {
  console.log('-', route.path)
  server[route.method.toLowerCase()](
    route.path, 
    logger,
    route.protected ? authenticationRequired : none,
    checkPermission(route.authorization),
    route.controller
  )
})

export default server
