import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { ICheckInsRepository } from '../ICheckInsRepository'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  private items: CheckIn[] = []
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      created_at: new Date(),
      gym_id: data.gym_id,
      id: randomUUID(),
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }
    this.items.push(checkIn)
    return checkIn
  }
}
