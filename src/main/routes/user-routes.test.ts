import request from 'supertest'
import app from '../config/app'
import { TypeormHelper } from '../../infra/db/helpers/typeorm-helper'

describe('User Routes', () => {
  beforeAll(async () => {
    await TypeormHelper.connect()
  })

  afterAll(async () => {
    await TypeormHelper.desconnect()
  })

  test('Should return an user on sucess', async () => {
    await request(app).post('/api/user')
      .send({
        name: 'Kauam',
        email: 'kauam@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
