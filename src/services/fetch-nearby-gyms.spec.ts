import { describe, expect, beforeEach, it } from 'vitest'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let service: FetchNearbyGymsService

describe('Fetch Nearby Gyms', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    service = new FetchNearbyGymsService(gymsRepository)
  })

  it('Should be able to fetch only nearby gyms', async () => {
    await gymsRepository.create({
      id: 'gym-01',
      title: 'Far Gym',
      description: '',
      phone: null,
      latitude: -25.4480991,
      longitude: -49.0652333,
    })

    gymsRepository.create({
      id: 'gym-02',
      title: 'Near Gym',
      description: '',
      phone: null,
      latitude: -25.4290227,
      longitude: -49.3112708,
    })

    const { gyms } = await service.execute({
      userLatitude: -25.4224996,
      userLongitude: -49.334863,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
