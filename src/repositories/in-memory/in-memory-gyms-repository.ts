import { IGymsRepository } from '../IGymsRepository'
import { Gym } from '@prisma/client'

export class InMemoryGymsRepository implements IGymsRepository {
  items: Gym[] = []
  async findById(id: string) {
    const gym = this.items.find((gym) => gym.id === id)
    return gym || null
  }
}
