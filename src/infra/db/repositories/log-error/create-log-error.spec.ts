import { getRepository } from 'typeorm'
import { TypeormHelper } from '../../helpers'
import { CreateLogError } from './create-log-error'

const makeSut = (): CreateLogError => {
  return new CreateLogError()
}

describe('CreateLogError  Repository', () => {
  beforeAll(async () => {
    await TypeormHelper.connect()
  })

  afterEach(async () => {
    await TypeormHelper.clear('log_error')
  })

  afterAll(async () => {
    await TypeormHelper.desconnect()
  })

  test('Should create an error log on sucess', async () => {
    const sut = makeSut()
    await sut.create('any_error')
    const count = await getRepository('log_error').count()
    expect(count).toBe(1)
  })
})
