import server from './server'
import Raven from 'raven'
import { HOST, PORT, SENTRY_URL } from './config'
import './io'

if (process.env.NODE_ENV === 'production') {
  Raven.config(SENTRY_URL).install()
}

server.listen(PORT, () => {
  console.log('Server listening at:', `http://${HOST}:${PORT}`)
})
