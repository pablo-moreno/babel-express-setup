import server from './server'
import './io'
import { config } from 'dotenv'

config()

const { HOST, PORT } = process.env

server.listen(PORT, () => {
  console.log('Server listening at:', `http://${HOST}:${PORT}`)
})