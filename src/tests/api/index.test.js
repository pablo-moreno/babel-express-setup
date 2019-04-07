import server from '../../server'
import request from 'supertest'
import mongoose from '../../mongoose'
import { createMocks, destroyMocks } from './mocks'

describe('API calls', () => {
  let chewie = undefined

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
    chewie = user
  })

  test('Get Me', async () => {
    const response = await request(server)
      .get('/auth/me')
      .set('x-auth', chewie.token)
    
    const user = response.body

    expect(user.username).toBe(chewie.username)
    expect(user.email).toBe(chewie.email)
    expect(user.token).toBe(chewie.token)
    chewie = user
  })

  test('Update user', async () => {
    const response = await request(server)
      .put('/auth/me')
      .set('x-auth', chewie.token)
      .send({
        firstName: 'Chewbacca'
      })
    
    const results = response.body
    expect(results.ok).toBe(1)
    expect(results.nModified).toBe(1)
      
    const getMe = await request(server)
      .get('/auth/me')
      .set('x-auth', chewie.token)
    
    const user = getMe.body
    expect(user.firstName).toBe('Chewbacca')
    chewie = user
  })
})
