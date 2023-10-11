import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import { CheckInService } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let service: CheckInService

describe('Check In Service', async () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    service = new CheckInService(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: null,
      latitude: -25.4224996,
      longitude: -49.334863,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // -25.4224996,-49.334863
  it('Should be able to check in', async () => {
    const { checkIn } = await service.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: -25.4224996,
      userLongitude: -49.334863,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await service.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: -25.4224996,
      userLongitude: -49.334863,
    })

    expect(async () => {
      await service.execute({
        gym_id: 'gym-01',
        user_id: 'user-01',
        userLatitude: -25.4224996,
        userLongitude: -49.334863,
      })
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Should be able to check in on different dates', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await service.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: -25.4224996,
      userLongitude: -49.334863,
    })

    vi.setSystemTime(new Date(2022, 0, 24, 23, 0, 0))
    const { checkIn } = await service.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: -25.4224996,
      userLongitude: -49.334863,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in on a distant gym', async () => {
    await expect(async () => {
      await service.execute({
        gym_id: 'gym-01',
        user_id: 'user-01',
        userLatitude: -25.3917972,
        userLongitude: -49.3324054,
      })
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
