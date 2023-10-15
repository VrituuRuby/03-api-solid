import { CheckIn, Prisma } from '@prisma/client'
import { ICheckInsRepository } from '../ICheckInsRepository'
import { prisma } from '@/libs/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    return await prisma.checkIn.create({ data })
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: { id: data.id },
      data,
    })

    return checkIn
  }

  async findById(id: string) {
    return await prisma.checkIn.findUnique({ where: { id } })
  }

  async findByUserOnDate(user_id: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async findManyByUserId(user_id: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: { user_id },
      skip: (page - 1) * 20,
      take: 20,
    })
    return checkIns
  }

  async countByUserId(user_id: string) {
    return await prisma.checkIn.count({ where: { user_id } })
  }
}
