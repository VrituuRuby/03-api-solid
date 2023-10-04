import { ICheckInsRepository } from '@/repositories/ICheckInsRepository'
import { CheckIn } from '@prisma/client'

interface ICheckInServiceRequest {
  user_id: string
  gym_id: string
}

interface ICheckInServiceResponse {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(private checkInsRepository: ICheckInsRepository) {}
  async execute({
    gym_id,
    user_id,
  }: ICheckInServiceRequest): Promise<ICheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.create({ user_id, gym_id })

    return { checkIn }
  }
}
