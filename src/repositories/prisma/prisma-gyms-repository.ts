import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { FindManyNearbyParams, IGymsRepository } from '../IGymsRepository'
import { prisma } from '@/libs/prisma'

export class PrismaGymsRepository implements IGymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({ where: { id } })
    return gym
  }

  async searchMany(query: string, page: number) {
    return await prisma.gym.findMany({
      where: {
        title: { contains: query },
      },
      skip: (page - 1) * 20,
      take: 20,
    })
  }

  async create(data: Prisma.GymCreateInput) {
    return await prisma.gym.create({ data })
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const { latitude, longitude } = params
    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * from gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }
}
