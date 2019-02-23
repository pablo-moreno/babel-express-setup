import express from 'express'


import jwt from 'jsonwebtoken'
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
     secret : process.env.SECRET_KEY,
     name : 'sessionId',
    })
  )
}
else if (process.env.NODE_ENV === 'development') {
  server.use(cors())
}

routes.map(r => {
  server[r.method.toLowerCase()](r.path, r.controller)
})

export default server