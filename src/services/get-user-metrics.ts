import { ICheckInsRepository } from '@/repositories/ICheckInsRepository'

interface IGetUserMetricsServiceRequest {
  user_id: string
}

interface IGetUserMetricsServiceResponse {
  checkInsCount: number
}

export class GetUserMetricsService {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    user_id,
  }: IGetUserMetricsServiceRequest): Promise<IGetUserMetricsServiceResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(user_id)

    return { checkInsCount }
  }
}
