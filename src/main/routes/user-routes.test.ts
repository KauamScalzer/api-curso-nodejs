import request from 'supertest'
import app from '../config/app'

describe('User Routes', () => {
  test('Should return an account on sucess', async () => {
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
