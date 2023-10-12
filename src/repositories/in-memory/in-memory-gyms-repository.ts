import { randomUUID } from 'crypto'
import { FindManyNearbyParams, IGymsRepository } from '../IGymsRepository'
import { Gym, Prisma } from '@prisma/client'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-distances'

export class InMemoryGymsRepository implements IGymsRepository {
  items: Gym[] = []

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findById(id: string) {
    const gym = this.items.find((gym) => gym.id === id)
    return gym || null
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        { latitude: Number(item.latitude), longitude: Number(item.longitude) },
      )

      return distance <= 10
    })
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
