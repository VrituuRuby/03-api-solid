import { UserAlreadyExistsError } from '@/services/errors/user-already-existis-error'
import { makeRegisterService } from '@/services/factories/make-register-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const getRegisterUserData = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = getRegisterUserData.parse(req.body)

  try {
    const registerService = makeRegisterService()

    await registerService.execute({ email, name, password })
    return reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}
