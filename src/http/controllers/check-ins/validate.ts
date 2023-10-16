import { makeValidateCheckInService } from '@/services/factories/make-validate-check-in-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInRouteParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInRouteParamsSchema.parse(request.params)

  const validateCheckinService = makeValidateCheckInService()

  await validateCheckinService.execute({ checkInId })
  return reply.status(204).send()
}
