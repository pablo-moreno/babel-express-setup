import express from 'express'
import cors from 'cors'
import session from 'express-session'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import routes from './routes'
import { SECRET_KEY } from './config'
import { none, authenticationRequired, checkPermission } from './middleware'

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

if (process.env.NODE_ENV === 'production') {
  server.use(helmet())
  server.set('trust proxy', 1)
  sessionConf.secure = true
}
else if (process.env.NODE_ENV === 'development') {
  server.use(cors())
}

server.use(session(sessionConf))

routes.forEach(route => {
  server[route.method.toLowerCase()](
    route.path, 
    route.protected ? authenticationRequired : none,
    checkPermission(route.authorization),
    route.controller
  )
})

export default server
