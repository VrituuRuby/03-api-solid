import { makeFetchUserCheckInsHistoryService } from '@/services/factories/make-fetch-user-check-ins-history-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(req: FastifyRequest, reply: FastifyReply) {
  const checkInsHistoryBodySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInsHistoryBodySchema.parse(req.params)

  const fetchUserCheckInService = makeFetchUserCheckInsHistoryService()
  const user_id = req.user.sub
  const { checkIns } = await fetchUserCheckInService.execute({
    page,
    user_id,
  })

  return reply.status(200).send({ checkIns })
}
