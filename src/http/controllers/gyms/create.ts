import { makeCreateGymService } from '@/services/factories/make-create-gym-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const getCreateGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } =
    getCreateGymBodySchema.parse(req.body)

  const createGymService = makeCreateGymService()

  await createGymService.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })
  return reply.status(201).send()
}
