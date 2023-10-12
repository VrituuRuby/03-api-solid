import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInService } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { rejects } from 'assert'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInRepository: InMemoryCheckInsRepository
let service: ValidateCheckInService

describe('Validate CheckIn Service', async () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    service = new ValidateCheckInService(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await service.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('Should not be able to validate an inexistent check-in', async () => {
    await expect(async () => {
      await service.execute({
        checkInId: 'inexistent-checkin-id',
      })
    }).rejects.toThrow(ResourceNotFoundError)
  })

  it('Should not be able to validate a check-in 20 minutes after its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 30))

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    vi.advanceTimersByTime(1000 * 60 * 21) // 21 minutes in milliseconds

    await expect(async () => {
      await service.execute({
        checkInId: createdCheckIn.id,
      })
    }).rejects.toThrow(LateCheckInValidationError)
  })
})
