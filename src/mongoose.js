import mongoose from 'mongoose'
import { DB_URL } from './config'

mongoose.connect(DB_URL, {
  useMongoClient: true
})
mongoose.Promise = global.Promise

export default mongoose
