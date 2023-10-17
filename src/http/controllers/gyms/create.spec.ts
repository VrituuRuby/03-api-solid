import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser'
import request from 'supertest'
import { it, describe, expect, beforeAll, afterAll } from 'vitest'

describe('Create Gym Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create new gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Gym',
        phone: '11999999999',
        latitude: -25.4224996,
        longitude: -49.334863,
      })

    expect(response.statusCode).toEqual(201)
  })
})
