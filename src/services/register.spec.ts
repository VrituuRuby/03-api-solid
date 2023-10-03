import { expect, describe, beforeEach, it } from 'vitest'
import { RegisterService } from './register'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { compare } from 'bcrypt'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-existis-error'

describe('Register Service', () => {
  let userRepository: IUsersRepository
  let registerService: RegisterService

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    registerService = new RegisterService(userRepository)
  })

  it('Should be able to register', async () => {
    const password = '123456'
    const { user } = await registerService.execute({
      email: 'jonhdoe@example.com',
      name: 'John Doe',
      password,
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password upon registration', async () => {
    const password = '123456'
    const { user } = await registerService.execute({
      email: 'jonhdoe@example.com',
      name: 'John Doe',
      password,
    })

    const isPasswordCorrectlyHashed = compare(password, user.password_hash)

    expect(isPasswordCorrectlyHashed)
  })

  it('Should should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await registerService.execute({
      email,
      name: 'John Doe',
      password: 'password',
    })

    await expect(async () => {
      await registerService.execute({
        email,
        name: 'John Doe',
        password: 'password',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
