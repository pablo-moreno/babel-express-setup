import { config } from 'dotenv'

config()

export const { HOST, PORT, DB_URL, JWT_SECRET, SECRET_KEY } = process.env
export const SALT = parseInt(process.env.SALT)