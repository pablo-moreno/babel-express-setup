import { hash, compare } from 'bcryptjs'
import { SALT } from './config'

export const hashPassword = async (password) => {
  return new Promise((resolve, reject) => {
    hash(password, SALT, (err, hash) => {
      if (err) {
        reject(err)
      }
      resolve(hash)
    })
  })
}

export const validatePassword = async (password, hashedPassword, verbose=false) => {
  if (verbose) {
    console.log(`Password: ${password}\nHashed Password: ${hashedPassword}`)
  }
  
  return new Promise((resolve, reject) => {
    compare(password, hashedPassword, (err, isValid) => {
      if (isValid) 
        resolve(true)
      else
        reject(false)
    })
  })
}
