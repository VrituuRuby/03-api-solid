import { ICheckInsRepository } from '@/repositories/ICheckInsRepository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

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

    checkIn.validated_at = new Date()

    this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
