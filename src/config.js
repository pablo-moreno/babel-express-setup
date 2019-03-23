import { config } from 'dotenv'

config()

export const { HOST, PORT, DB_URL } = process.env
export const SALT = parseInt(process.env.SALT)