import { IUsersRepository } from '@/repositories/IUsersRepository'
import { InvalidCredentialsError } from './errors/wrong-credentials-error'
import { compare } from 'bcrypt'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface IGetUserProfileServiceRequest {
  userId: string
}

interface IGetUserProfileServiceResponse {
  user: User
}

export class GetUserProfileService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
  }: IGetUserProfileServiceRequest): Promise<IGetUserProfileServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw new ResourceNotFoundError()

    return {
      user,
    }
  }
}
