import { hash } from 'bcrypt'
import { UserAlreadyExistsError } from './errors/user-already-existis-error'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { User } from '@prisma/client'

interface RegisterUserServiceParams {
  name: string
  email: string
  password: string
}

interface RegisterServiceResponse {
  user: User
}

export class RegisterService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUserServiceParams): Promise<RegisterServiceResponse> {
    const existingEmail = await this.usersRepository.findByEmail(email)
    if (existingEmail) throw new UserAlreadyExistsError()

    const password_hash = await hash(password, 6)
    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    })

    return {
      user,
    }
  }
}
