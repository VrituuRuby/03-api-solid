import { describe, it, beforeEach, expect } from 'vitest'
import { SearchGymsService } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let service: SearchGymsService

describe('Fetch User Check-Ins History Service', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    service = new SearchGymsService(gymsRepository)
  })

  it('Should be able to search for gyms', async () => {
    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: null,
      latitude: -25.4224996,
      longitude: -49.334863,
    })

    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: '',
      phone: null,
      latitude: -25.4224996,
      longitude: -49.334863,
    })

    const { gyms } = await service.execute({
      query: 'Type',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'TypeScript Gym' })])
  })
  it('Should be able to search paginated gyms search ', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-${i}`,
        title: `TypeScript Gym ${i}`,
        description: '',
        phone: null,
        latitude: -25.4224996,
        longitude: -49.334863,
      })
    }

    const { gyms } = await service.execute({
      query: 'Type',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ id: 'gym-21', title: 'TypeScript Gym 21' }),
      expect.objectContaining({ id: 'gym-22', title: 'TypeScript Gym 22' }),
    ])
  })
})
