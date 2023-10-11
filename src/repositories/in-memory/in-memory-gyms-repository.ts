import { randomUUID } from 'crypto'
import { IGymsRepository } from '../IGymsRepository'
import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryGymsRepository implements IGymsRepository {
  items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((gym) => gym.id === id)
    return gym || null
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(String(data.latitude)),
      longitude: new Prisma.Decimal(String(data.longitude)),
      createdAt: new Date(),
    }

    this.items.push(gym)

    return gym
  }
}
