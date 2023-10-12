import { ICheckInsRepository } from '@/repositories/ICheckInsRepository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface ValidadeCheckInServiceRequest {
  checkInId: string
}

interface ValidadeCheckInServiceResponse {
  checkIn: CheckIn
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidadeCheckInServiceRequest): Promise<ValidadeCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) throw new ResourceNotFoundError()

    const createdAtTimestamp = checkIn.created_at.getTime()
    const nowTimestamp = new Date().getTime()
    const distanceInMinutesFromCheckInCreation =
      (nowTimestamp - createdAtTimestamp) / (1000 * 60)

    console.log(distanceInMinutesFromCheckInCreation)
    if (distanceInMinutesFromCheckInCreation > 20)
      throw new LateCheckInValidationError()

    checkIn.validated_at = new Date()

    this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
