import { ICheckInsRepository } from '@/repositories/ICheckInsRepository'
import { describe, it, beforeEach, afterAll, expect } from 'vitest'
import { CheckInService } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInRepository: ICheckInsRepository
let service: CheckInService

describe('Check In Service', async () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    service = new CheckInService(checkInRepository)
  })
  it('Should be able to check in', async () => {
    const { checkIn } = await service.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in twice in the same day', async () => {
    await service.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    expect(async () => {
      await service.execute({
        gym_id: 'gym-01',
        user_id: 'user-01',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
