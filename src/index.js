import server from './server'
import { HOST, PORT } from './config'
import './io'

server.listen(PORT, () => {
  console.log('Server listening at:', `http://${HOST}:${PORT}`)
})