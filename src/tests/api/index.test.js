import server from '../../server'
import request from 'supertest'

describe('API calls', () => {
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
})
