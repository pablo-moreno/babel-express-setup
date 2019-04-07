import server from '../../server'
import request from 'supertest'
import mongoose from '../../mongoose'
import { createMocks, destroyMocks } from './mocks'

describe('API calls', () => {
  beforeAll(async () => {
    const users = await createMocks()
    console.log('Users created:', users)
    return users
  })

  afterAll(async (done) => {
    const results = await destroyMocks()
    console.log('Removed items:', results)
    mongoose.disconnect()
    done()
  })

  test('Sign up', async () => {
    const response = await request(server)
      .post('/auth/sign-up')
      .send({ 
        username: 'chewie',
        password: 'gruaaargh',
        password2: 'gruaaargh',
        email: 'chewie@mail.com'
      })
    const user = response.body

    expect(response.status).toBe(200)
    expect(user.username).toBe('chewie')
    expect(user.email).toBe('chewie@mail.com')
  })

  test('Login', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({ 
        email: 'chewie@mail.com',
        password: 'gruaaargh',
      })
    const user = response.body
    
    expect(response.status).toBe(200)
    expect(user.username).toBe('chewie')
    expect(user.email).toBe('chewie@mail.com')
    expect(user.token).not.toBe(undefined)
  })
})
