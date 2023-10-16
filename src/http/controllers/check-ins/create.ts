import { makeCheckInService } from '@/services/factories/make-check-in-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const getCreateCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const getGymIdFormParams = z.object({
    gymId: z.string().uuid(),
  })

  const { latitude, longitude } = getCreateCheckInBodySchema.parse(request.body)
  const { gymId } = getGymIdFormParams.parse(request.params)

  const createCheckInService = makeCheckInService()
  const user_id = request.user.sub

  await createCheckInService.execute({
    gym_id: gymId,
    user_id,
    userLatitude: latitude,
    userLongitude: longitude,
  })
  return reply.status(201).send()
}
