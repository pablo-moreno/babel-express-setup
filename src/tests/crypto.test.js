import { hashPassword, validatePassword } from '../utils'

describe('Password management', () => {
  test('Validate correct password', async () => {
    const mPassword = '1234'
    const hashedPassword = await hashPassword(mPassword)
    const result = await validatePassword(mPassword, hashedPassword)
    expect(result).toBe(true)
  })

  test('Wrong password', async () => {
    const mPassword = '1234'
    const hashedPassword = await hashPassword(mPassword)
    const result = await validatePassword('thisisnotthepassword', hashedPassword)
    console.log('result', result)
    expect(result).toBe(false)
  })
})
