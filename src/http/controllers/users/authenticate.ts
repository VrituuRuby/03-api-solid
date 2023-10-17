import { InvalidCredentialsError } from '@/services/errors/wrong-credentials-error'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)

  try {
    const authenticateService = makeAuthenticateService()

    const { user } = await authenticateService.execute({ email, password })

    const token = await reply.jwtSign(
      {},
      {
        sign: { sub: user.id },
      },
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: { sub: user.id, expiresIn: '7d' },
      },
    )

    return reply.status(200).send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
