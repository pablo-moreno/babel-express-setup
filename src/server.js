import express from 'express'
import cors from 'cors'
import session from 'express-session'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import routes from './routes'

// Create server
const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(compression())

if (process.env.NODE_ENV === 'production') {
  server.use(helmet())
  server.set('trust proxy', 1)
  server.use(session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false
    })
  )
}
else if (process.env.NODE_ENV === 'development') {
  server.use(cors())
}

console.log('Routes: ')
routes.forEach(route => {
  console.log('-', route.path)
  server[route.method.toLowerCase()](route.path, route.controller)
})

export default server
