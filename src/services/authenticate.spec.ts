import { IUsersRepository } from '@/repositories/IUsersRepository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcrypt'
import { InvalidCredentialsError } from './errors/wrong-credentials-error'

describe('Authenticate User Service', async () => {
  let userRepository: IUsersRepository
  let service: AuthenticateService

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    service = new AuthenticateService(userRepository)
  })

  it('Should be able to authenticate a user', async () => {
    await userRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password_hash: await hash('123456', 6),
      id: 'random-uuid',
    })

    const { user } = await service.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should not be able to authenticate with wrong email', async () => {
    expect(async () => {
      await service.execute({
        email: 'johndoe@example.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('Should not be able to authenticate with wrong password', async () => {
    await userRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password_hash: await hash('123456', 6),
      id: 'random-uuid',
    })
    expect(async () => {
      await service.execute({
        email: 'johndoe@example.com',
        password: 'wrongpassword',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
