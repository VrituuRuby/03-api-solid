import { ICheckInsRepository } from '@/repositories/ICheckInsRepository'
import { CheckIn } from '@prisma/client'

interface IFetchUserCheckInsHistoryServiceRequest {
  user_id: string
  page: number
}

interface IFetchUserCheckInsHistoryServiceResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    user_id,
    page,
  }: IFetchUserCheckInsHistoryServiceRequest): Promise<IFetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      user_id,
      page,
    )

    return { checkIns }
  }
}
