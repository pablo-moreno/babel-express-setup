import { hash, compare } from 'bcryptjs'
import { SALT } from './config'

export const hashPassword = async password => hash(password, SALT)
export const validatePassword = async (password, hashedPassword) => compare(password, hashedPassword)
