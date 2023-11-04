import { TypeormHelper } from '../../helpers'
import { CreateUserRepository } from './create-user-repository'

const makeSut = (): CreateUserRepository => {
  return new CreateUserRepository()
}

describe('CreateUserRepository', () => {
  beforeAll(async () => {
    await TypeormHelper.connect()
  })

  afterEach(async () => {
    await TypeormHelper.clear('user')
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
