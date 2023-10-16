import { makeGetUserMetricsService } from '@/services/factories/make-get-user-metrics-service'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(req: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsService = makeGetUserMetricsService()
  const user_id = req.user.sub
  const { checkInsCount } = await getUserMetricsService.execute({
    user_id,
  })

  return reply.status(200).send({ checkInsCount })
}
