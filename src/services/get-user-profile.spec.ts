import { IUsersRepository } from '@/repositories/IUsersRepository'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterService } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileService } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('Get User Profile Service', async () => {
  let userRepository: IUsersRepository
  let service: GetUserProfileService

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    service = new GetUserProfileService(userRepository)
  })

  it('Should be able to get user profile', async () => {
    const createdUser = await userRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password_hash: 'hashed-password',
    })

    const { user } = await service.execute({ userId: createdUser.id })

    expect(user.name).toEqual('John Doe')
  })

  it('Should not be able to get an user profile with non-existing id', async () => {
    expect(async () => {
      const { user } = await service.execute({ userId: 'non-existing-id' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
