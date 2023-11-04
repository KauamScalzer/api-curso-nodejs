import jwt from 'jsonwebtoken'
import { EncrypterJwtAdapter } from './encrypter-jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign () {
    return await new Promise(resolve => resolve('any_token'))
  }
}))

const makeSut = (): EncrypterJwtAdapter => {
  return new EncrypterJwtAdapter('secret')
}

describe('EncrypterJwtAdapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should return a token on sucess', async () => {
    const sut = makeSut()
    const result = await sut.encrypt('any_id')
    expect(result).toBe('any_token')
  })
})
