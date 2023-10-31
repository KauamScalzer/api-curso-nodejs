import { TypeormHelper } from '../../helpers'
import { CreateUser } from './create-user'

const makeSut = (): CreateUser => {
  return new CreateUser()
}

describe('CreateUser Repository', () => {
  beforeAll(async () => {
    await TypeormHelper.connect()
  })

  afterAll(async () => {
    await TypeormHelper.desconnect()
  })

  test('Should return an user on sucess', async () => {
    const sut = makeSut()
    const result = await sut.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
    expect(result).toBeTruthy()
    expect(result.id).toBeTruthy()
    expect(result.name).toBe('any_name')
    expect(result.email).toBe('any_email@gmail.com')
    expect(result.password).toBe('any_password')
  })
})
