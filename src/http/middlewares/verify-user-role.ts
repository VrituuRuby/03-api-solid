import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(desiredRole: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user
    if (role !== desiredRole) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
