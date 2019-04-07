import server from '../../server'
import request from 'supertest'

describe('API calls', () => {
  test('Sign up', async () => {
    const response = await request(server).get('/auth/sign-up')
    expect(response.status).toBe(404)
  })
})
