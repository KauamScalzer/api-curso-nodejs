import jwt from 'jsonwebtoken'
import { EncrypterJwtAdapter } from './encrypter-jwt-adapter'

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
})
