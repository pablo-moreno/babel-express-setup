import { config } from 'dotenv'

config()

export const { 
  HOST, 
  PORT, 
  DB_URL, 
  JWT_SECRET,
  REDIS_URL,
  SECRET_KEY, 
  UPLOADS_PATH, 
  UPLOADS_URL,
  SENTRY_URL,
} = process.env

export const SALT = parseInt(process.env.SALT)
export const DEBUG = process.env.NODE_ENV !== 'production'
export const EXPIRATION_DAYS = 7
