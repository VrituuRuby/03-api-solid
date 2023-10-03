import { Prisma, User } from '@prisma/client'
import { IUsersRepository } from '../IUsersRepository'

export class InMemoryUsersRepository implements IUsersRepository {
  async findById(id: string): Promise<User | null> {
    const user = this.items.find((user) => user.id === id) || null
    return user
  }

  private items: User[] = []
  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email) || null
    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: 'random-uuid',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
