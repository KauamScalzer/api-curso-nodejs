import request from 'supertest'
import app from '../config/app'
import { TypeormHelper } from '../../infra/db/helpers/typeorm-helper'
import { getRepository } from 'typeorm'
import { hash } from 'bcrypt'

describe('User Routes', () => {
  beforeAll(async () => {
    await TypeormHelper.connect()
  })

  afterEach(async () => {
    await TypeormHelper.clear('user')
  })

  afterAll(async () => {
    await TypeormHelper.desconnect()
  })

  describe('POST /user', () => {
    test('Should return 200 on sucess', async () => {
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

  describe('POST /user/authentication', () => {
    test('Should return an access token on sucess', async () => {
      const password = await hash('123', 12)
      await getRepository('user').save({
        name: 'kauam',
        password,
        email: 'kauam@gmail.com'
      })
      await request(app).post('/api/user/authentication')
        .send({
          email: 'kauam@gmail.com',
          password: '123'
        })
        .expect(200)
    })
  })
})
