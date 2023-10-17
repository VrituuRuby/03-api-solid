import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser'
import request from 'supertest'
import { it, describe, expect, beforeAll, afterAll } from 'vitest'

describe('Search Gyms Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Gym',
        phone: '11999999999',
        latitude: -25.4224996,
        longitude: -49.334863,
      })
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'A Different Gym',
        phone: '11999999999',
        latitude: -25.4224996,
        longitude: -49.334863,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ query: 'JavaScript', page: 1 })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
  })
})
