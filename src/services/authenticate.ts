import { IUsersRepository } from '@/repositories/IUsersRepository'
import { InvalidCredentialsError } from './errors/wrong-credentials-error'
import { compare } from 'bcrypt'
import { User } from '@prisma/client'

interface IAuthenticateServiceRequest {
  email: string
  password: string
}

interface IAuthenticateServiceResponse {
  user: User
}

class AuthenticateService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateServiceRequest): Promise<IAuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const doPasswordsMatch = await compare(password, user.password_hash)

    if (!doPasswordsMatch) throw new InvalidCredentialsError()

    return {
      user,
    }
  }
}

export { AuthenticateService }
