import { User } from '../../../models/auth'
import { hashPassword } from '../../../utils'

export const createMocks = async () => {
  const results = []
  const users = [
    {
      username: 'leia',
      email: 'leia@theresistance.com',
      password: 'AllIWantIsHope'
    },
    {
      username: 'luke',
      email: 'luke@theresistance.com',
      password: 'EveryWordYouSaidIsWrong'
    },
    {
      username: 'han',
      email: 'han@theresistance.com',
      password: 'IKnow'
    },
  ]

  users.forEach(async (user) => {
    const u = new User({
      ...user,
      password: await hashPassword(user.password)
    })
    const result = await u.save()
    console.log('Created user: ', result.username)
    results.push(result)
  })

  return results
}

export const destroyMocks = async () => {
  return User.deleteMany({})
}