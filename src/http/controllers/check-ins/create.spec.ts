import { app } from '@/app'
import { prisma } from '@/libs/prisma'
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser'
import request from 'supertest'
import { it, describe, expect, beforeAll, afterAll } from 'vitest'

describe('Create Check-In Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to check in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        description: 'Gym',
        phone: '11999999999',
        latitude: -25.4224996,
        longitude: -49.334863,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/checkins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -25.4224996,
        longitude: -49.334863,
      })

    expect(response.statusCode).toEqual(201)
  })
})
