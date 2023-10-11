import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsService } from './get-user-metrics'

let checkInRepository: InMemoryCheckInsRepository
let service: GetUserMetricsService

describe('Get User Metrics Service', async () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    service = new GetUserMetricsService(checkInRepository)
  })

  it('Should be able to get user check-ins count from metrics', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await service.execute({
      user_id: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
