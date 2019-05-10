import server from './server'
import './io'

server.listen(PORT, () => {
  console.log('Server listening at:', `http://${HOST}:${PORT}`)
})
