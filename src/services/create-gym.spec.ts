import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymService } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let service: CreateGymService
let gymsRepository: InMemoryGymsRepository
describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    service = new CreateGymService(gymsRepository)
  })

  it('Should be able to create a new gym', async () => {
    const data = {
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -25.4224996,
      longitude: -49.334863,
    }
    const { gym } = await service.execute(data)

    expect(gym.id).toEqual(expect.any(String))
  })
})
