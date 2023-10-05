import { ICheckInsRepository } from '@/repositories/ICheckInsRepository'
import { IGymsRepository } from '@/repositories/IGymsRepository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-distances'

interface ICheckInServiceRequest {
  user_id: string
  gym_id: string
  userLatitude: number
  userLongitude: number
}

interface ICheckInServiceResponse {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository,
  ) {}

  async execute({
    gym_id,
    user_id,
    userLatitude,
    userLongitude,
  }: ICheckInServiceRequest): Promise<ICheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gym_id)

    if (!gym) throw new ResourceNotFoundError()

    // calculcate distance between gym and user
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1
    if (distance > MAX_DISTANCE_IN_KILOMETERS) throw new Error()

    const hasCheckInToday = await this.checkInsRepository.findByUserOnDate(
      user_id,
      new Date(),
    )

    if (hasCheckInToday) throw new Error()

    const checkIn = await this.checkInsRepository.create({ user_id, gym_id })

    return { checkIn }
  }
}
