import { User } from '../../../models/auth'
import { hashPassword } from '../../../utils'

export const createMocks = async () => {
  const results = []
  const users = [
    {
      username: 'leia',
      email: 'leia@theresistance.com',
      password: await hashPassword('AllIWantIsHope')
    },
    {
      username: 'luke',
      email: 'luke@theresistance.com',
      password: await hashPassword('EveryWordYouSaidIsWrong'),
    },
    {
      username: 'han',
      email: 'han@theresistance.com',
      password: await hashPassword('IKnow'),
    },
  ]

  users.forEach(async ({ username, email, password }) => {
    const u = new User({ username, email, password })
    const result = await u.save()
    console.log('Created user: ', result.username)
    results.push(result)
  })

  return results
}

export const destroyMocks = async () => {
  return User.deleteMany({})
}